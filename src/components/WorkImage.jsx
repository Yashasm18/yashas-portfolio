import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";
const WorkImage = (props) => {
  const [isVideo, setIsVideo] = useState(false);
  const [video, setVideo] = useState("");
  const handleMouseEnter = () => {
    if (props.video) {
      setIsVideo(true);
      setVideo(`/video/${props.video}`);
    }
  };
  return <div className="work-image">
      <a
    className="work-image-in"
    href={props.link}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={() => setIsVideo(false)}
    target="_blank"
    data-cursor={"disable"}
  >
        {props.link && <div className="work-link">
            <MdArrowOutward />
          </div>}
        <img src={props.image} alt={props.alt} />
        {isVideo && <video src={video} autoPlay muted playsInline loop />}
      </a>
    </div>;
};
var WorkImage_default = WorkImage;
export {
  WorkImage_default as default
};
