import "./styles/style.css";
const HoverLinks = ({ text, cursor }) => {
  return <div className="hover-link" data-cursor={!cursor && `disable`}>
      <div className="hover-in">
        {text} <div>{text}</div>
      </div>
    </div>;
};
var HoverLinks_default = HoverLinks;
export {
  HoverLinks_default as default
};
