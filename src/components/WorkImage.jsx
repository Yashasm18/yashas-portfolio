import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";
const WorkImage = (props) => {
  const [isVideo, setIsVideo] = useState(false);
  const [video, setVideo] = useState("");
  const handleMouseEnter = async () => {
    if (props.video) {
      setIsVideo(true);
      const response = await fetch(`src/assets/${props.video}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setVideo(blobUrl);
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
