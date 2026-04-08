const ListItem = ({ children, onClick }) => {
  return (
    <>
      <li
        
        onClick={onClick}
      >{children}</li>
    </>
  );
}
export default ListItem;