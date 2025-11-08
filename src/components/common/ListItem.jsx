const ListItem = ({ children, onClick }) => {
  return (
    <>
      <li
        className="px-2 py-1 rounded-lg hover:bg-main active:opacity-80 cursor-pointer"
        onClick={onClick}
      >{children}</li>
    </>
  );
}
export default ListItem;