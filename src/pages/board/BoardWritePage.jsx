import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { boardAPI } from '../../api/boardAPI';
import '../../styles/pages/BoardPage.css';
import '../../styles/pages/BoardWritePage.css';

const postTypeOptions = [
  { value: 'free', label: '자유글' },
  { value: 'info', label: '정보글' },
];

const toolbarActions = [
  { id: 'bold', label: 'B', title: '굵게', command: 'bold' },
  { id: 'italic', label: 'I', title: '기울임', command: 'italic' },
  { id: 'underline', label: 'U', title: '밑줄', command: 'underline' },
  { id: 'strike', label: 'S', title: '취소선', command: 'strikeThrough' },
];

const initialForm = {
  categoryKey: '',
  postType: 'free',
  title: '',
  tag: '',
};

const buildFileId = (file) => `${file.name}-${file.size}-${file.lastModified}`;

const normalizeEditorHtml = (html) => {
  const trimmed = html.trim();

  if (!trimmed || trimmed === '<br>' || trimmed === '<div><br></div>' || trimmed === '<p><br></p>') {
    return '';
  }

  return html;
};

const extractTextFromHtml = (html) => {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return (doc.body.textContent || '').trim();
};

const BoardWritePage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const selectionRangeRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [editorHtml, setEditorHtml] = useState('');
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await boardAPI.getCategories();
        setCategories(response.data || []);
      } catch (fetchError) {
        console.error('카테고리 로드 실패:', fetchError);
        setError('카테고리를 불러오지 못했습니다.');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;

    const matchedCategory = categories.find((item) => item.categoryKey === category);
    const fallbackCategory = matchedCategory?.categoryKey || categories[0]?.categoryKey || '';

    setForm((prev) => ({
      ...prev,
      categoryKey: fallbackCategory,
    }));
  }, [categories, category]);

  const currentCategory = useMemo(
    () => categories.find((item) => item.categoryKey === form.categoryKey),
    [categories, form.categoryKey]
  );

  const previewHtml = useMemo(() => {
    if (editorHtml) return editorHtml;
    return '<p class="board-write__preview-empty">본문 미리보기가 여기에 표시됩니다.</p>';
  }, [editorHtml]);

  const handleFieldChange = (field) => (event) => {
    const nextValue = event.target.value;

    setForm((prev) => ({
      ...prev,
      [field]: nextValue,
    }));
  };

  const syncEditorState = () => {
    const nextHtml = normalizeEditorHtml(editorRef.current?.innerHTML || '');
    setEditorHtml(nextHtml);
  };

  const saveSelectionRange = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editorRef.current) return;

    const range = selection.getRangeAt(0);
    if (!editorRef.current.contains(range.commonAncestorContainer)) return;

    selectionRangeRef.current = range.cloneRange();
  };

  const restoreSelectionRange = () => {
    const selection = window.getSelection();
    const range = selectionRangeRef.current;

    if (!selection || !range) return false;

    selection.removeAllRanges();
    selection.addRange(range);
    return true;
  };

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const runCommand = (command, value = null) => {
    focusEditor();
    restoreSelectionRange();
    document.execCommand('styleWithCSS', false, false);
    document.execCommand(command, false, value);
    saveSelectionRange();
    syncEditorState();
  };

  const getCurrentRange = () => {
    focusEditor();
    restoreSelectionRange();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    if (!editorRef.current?.contains(range.commonAncestorContainer)) return null;

    return range;
  };

  const updateSelectionToNode = (node) => {
    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
    selectionRangeRef.current = range.cloneRange();
  };

  const unwrapElement = (element) => {
    const parent = element.parentNode;
    if (!parent) return;

    while (element.firstChild) {
      parent.insertBefore(element.firstChild, element);
    }

    parent.removeChild(element);
  };

  const toggleBold = () => {
    const range = getCurrentRange();
    if (!range || range.collapsed) return;

    let node = range.commonAncestorContainer;
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentElement;
    }

    const boldAncestor = node?.closest?.('strong, b');
    if (
      boldAncestor &&
      editorRef.current?.contains(boldAncestor) &&
      range.toString().trim() === boldAncestor.textContent?.trim()
    ) {
      const parentBlock = boldAncestor.parentElement || editorRef.current;
      unwrapElement(boldAncestor);
      updateSelectionToNode(parentBlock);
      syncEditorState();
      return;
    }

    const strong = document.createElement('strong');
    strong.appendChild(range.extractContents());
    range.insertNode(strong);
    updateSelectionToNode(strong);
    syncEditorState();
  };

  const getClosestBlockTag = () => {
    const range = getCurrentRange();
    if (!range || !editorRef.current) return '';

    let node = range.commonAncestorContainer;
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentElement;
    }

    while (node && node !== editorRef.current) {
      const tagName = node.tagName?.toLowerCase();
      if (['h2', 'blockquote', 'ul', 'ol', 'p', 'div'].includes(tagName)) {
        return tagName;
      }
      node = node.parentElement;
    }

    return '';
  };

  const toggleHeading = () => {
    const currentTag = getClosestBlockTag();
    runCommand('formatBlock', currentTag === 'h2' ? 'p' : 'h2');
  };

  const toggleQuote = () => {
    const currentTag = getClosestBlockTag();
    runCommand('formatBlock', currentTag === 'blockquote' ? 'p' : 'blockquote');
  };

  const toggleList = () => {
    runCommand('insertUnorderedList');
  };

  const handleInsertLink = () => {
    const url = window.prompt('링크 주소를 입력해주세요.');
    if (!url) return;

    runCommand('createLink', url);
  };

  const appendFiles = (nextFiles) => {
    setFiles((prev) => {
      const existingIds = new Set(prev.map((item) => item.id));

      const additions = nextFiles
        .filter((file) => !existingIds.has(buildFileId(file)))
        .map((file) => ({
          id: buildFileId(file),
          file,
        }));

      return [...prev, ...additions];
    });
  };

  const handleImagePicked = (event) => {
    appendFiles(Array.from(event.target.files || []));
    event.target.value = '';
  };

  const handleAttachmentPicked = (event) => {
    appendFiles(Array.from(event.target.files || []));
    event.target.value = '';
  };

  const handleRemoveFile = (id) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const contentHtml = normalizeEditorHtml(editorRef.current?.innerHTML || editorHtml);
    const contentText = extractTextFromHtml(contentHtml);

    if (!form.title.trim() || !contentText || !currentCategory?.id) {
      setError('제목과 본문은 필수입니다.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        categoryId: currentCategory.id,
        postType: form.postType,
        title: form.title.trim(),
        tag: form.tag.trim() || null,
        content: contentHtml,
      };

      const response = await boardAPI.createPostFormData({
        payload,
        files: files.map((item) => item.file),
      });

      const createdPost = response.data;
      if (createdPost?.id) {
        navigate(`/board/${createdPost.categoryKey || form.categoryKey}/post/${createdPost.id}`);
        return;
      }

      navigate(`/board/${form.categoryKey}`);
    } catch (submitError) {
      console.error('게시글 작성 실패:', submitError);
      setError('게시글 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (categoriesLoading) {
    return (
      <div className="board-page">
        <div className="board-loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="board-page">
      <nav className="board-nav">
        <div className="board-nav__container">
          <div className="board-nav__tabs">
            {categories.map((cat) => (
              <Link
                key={cat.categoryKey}
                to={`/board/${cat.categoryKey}`}
                className={`board-nav__tab ${form.categoryKey === cat.categoryKey ? 'board-nav__tab--active' : ''}`}
              >
                <span className={`board-nav__icon board-nav__icon--${cat.categoryKey}`}>
                  {cat.iconUrl ? (
                    <img src={cat.iconUrl} alt={cat.name} className="board-nav__icon-img" />
                  ) : (
                    cat.name.substring(0, 2).toUpperCase()
                  )}
                </span>
                <span className="board-nav__label">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <section className="board-write">
        <div className="board-write__container">
          <div className="board-write__header">
            <div>
              <p className="board-write__eyebrow">게시글 작성</p>
              <h1 className="board-write__title">{currentCategory?.name || '커뮤니티'} 글쓰기</h1>
              <p className="board-write__subtitle">자유롭게 글을 작성하고 필요한 파일을 함께 첨부해보세요.</p>
            </div>
            <button className="board-write__cancel" onClick={() => navigate(`/board/${form.categoryKey || category || ''}`)}>
              취소
            </button>
          </div>

          <div className="board-write__grid">
            <form className="board-write__form" onSubmit={handleSubmit}>
              <div className="board-write__card">
                <div className="board-write__topline">
                  <div className="board-write__category-chip">
                    <span>현재 게시판</span>
                    <strong>{currentCategory?.name || form.categoryKey}</strong>
                  </div>

                  <label className="board-write__type-field">
                    <span>글 유형</span>
                    <select value={form.postType} onChange={handleFieldChange('postType')}>
                      {postTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="board-write__field">
                  <span>제목</span>
                  <input
                    type="text"
                    value={form.title}
                    onChange={handleFieldChange('title')}
                    placeholder="제목을 입력해주세요."
                    maxLength={120}
                  />
                </label>

                <label className="board-write__field">
                  <span>태그</span>
                  <input
                    type="text"
                    value={form.tag}
                    onChange={handleFieldChange('tag')}
                    placeholder="예: 공략, 질문, 업데이트"
                    maxLength={30}
                  />
                </label>

                <div className="board-write__field">
                  <span>본문</span>
                  <div className="board-write__editor-shell">
                    <div className="board-write__toolbar">
                      <div className="board-write__toolbar-group">
                        {toolbarActions.map((action) => (
                          <button
                            key={action.id}
                            type="button"
                            className={`board-write__toolbar-btn board-write__toolbar-btn--${action.id}`}
                            title={action.title}
                            onMouseDown={(event) => {
                              event.preventDefault();
                              if (action.id === 'bold') {
                                toggleBold();
                                return;
                              }
                              runCommand(action.command);
                            }}
                          >
                            {action.label}
                          </button>
                        ))}
                        <button
                          type="button"
                          className="board-write__toolbar-btn"
                          title="제목 스타일"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            toggleHeading();
                          }}
                        >
                          T
                        </button>
                        <button
                          type="button"
                          className="board-write__toolbar-btn"
                          title="목록"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            toggleList();
                          }}
                        >
                          List
                        </button>
                        <button
                          type="button"
                          className="board-write__toolbar-btn"
                          title="인용"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            toggleQuote();
                          }}
                        >
                          "
                        </button>
                        <button
                          type="button"
                          className="board-write__toolbar-btn"
                          title="링크"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            handleInsertLink();
                          }}
                        >
                          Link
                        </button>
                      </div>

                      <div className="board-write__toolbar-group">
                        <button
                          type="button"
                          className="board-write__toolbar-btn"
                          title="이미지 첨부"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            imageInputRef.current?.click();
                          }}
                        >
                          Img
                        </button>
                        <button
                          type="button"
                          className="board-write__toolbar-btn"
                          title="파일 첨부"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            fileInputRef.current?.click();
                          }}
                        >
                          File
                        </button>
                      </div>
                    </div>

                    <div
                      ref={editorRef}
                      className="board-write__editor"
                      contentEditable
                      suppressContentEditableWarning
                      data-placeholder="다른 유저와 나누고 싶은 내용을 작성해주세요."
                      onInput={syncEditorState}
                      onKeyUp={saveSelectionRange}
                      onMouseUp={saveSelectionRange}
                      onFocus={saveSelectionRange}
                      onBlur={saveSelectionRange}
                    />

                    <div className="board-write__editor-footer">
                      <span>편집한 내용이 아래 미리보기에 바로 반영됩니다.</span>
                      <span>{extractTextFromHtml(editorHtml).length}자</span>
                    </div>
                  </div>
                </div>

                <input
                  ref={imageInputRef}
                  className="board-write__hidden-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagePicked}
                />
                <input
                  ref={fileInputRef}
                  className="board-write__hidden-input"
                  type="file"
                  multiple
                  onChange={handleAttachmentPicked}
                />

                {files.length > 0 && (
                  <div className="board-write__attachments board-write__attachments--embedded">
                    <div className="board-write__attachments-head">
                      <p className="board-write__attachments-title">첨부파일</p>
                      <p className="board-write__attachments-copy">선택한 파일은 게시글과 함께 업로드됩니다.</p>
                    </div>

                    <div className="board-write__file-list">
                      {files.map((item) => (
                        <div key={item.id} className="board-write__file-item">
                          <div>
                            <strong>{item.file.name}</strong>
                            <span>{Math.ceil(item.file.size / 1024)} KB</span>
                          </div>
                          <button type="button" onClick={() => handleRemoveFile(item.id)}>
                            제거
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {error ? <p className="board-write__error">{error}</p> : null}

                <div className="board-write__actions">
                  <button type="button" className="board-write__ghost" onClick={() => navigate(`/board/${form.categoryKey}`)}>
                    목록으로
                  </button>
                  <button type="submit" className="board-write__submit" disabled={isSubmitting}>
                    {isSubmitting ? '등록 중...' : '게시글 등록'}
                  </button>
                </div>
              </div>
            </form>

            <aside className="board-write__aside">
              <div className="board-write__card board-write__card--soft">
                <p className="board-write__tip-label">작성 가이드</p>
                <h2 className="board-write__tip-title">읽기 쉬운 글로 정리해보세요.</h2>
                <ul className="board-write__tips">
                  <li>제목은 핵심이 잘 보이도록 간결하게 적어주세요.</li>
                  <li>목록, 인용, 링크 같은 서식을 활용하면 읽기 편합니다.</li>
                  <li>첨부한 이미지는 현재 첨부 영역에서 함께 확인할 수 있습니다.</li>
                </ul>
              </div>

              <div className="board-write__card">
                <p className="board-write__preview-label">실시간 미리보기</p>
                <div className="board-write__preview">
                  <div className="board-write__preview-meta">
                    <span className={`post-item__type post-item__type--${form.postType}`}>
                      {postTypeOptions.find((option) => option.value === form.postType)?.label}
                    </span>
                    {form.tag.trim() ? <span className="post-item__tag">{form.tag.trim()}</span> : null}
                  </div>
                  <h3>{form.title.trim() || '제목이 여기에 표시됩니다.'}</h3>
                  <div className="board-write__preview-body" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BoardWritePage;
