import {
  faFileCircleQuestion,
  faPlus,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ErrorControllerProps {
  code: number;
}

function ErrorController({ code }: ErrorControllerProps) {
  if (code === 204) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <h1 className="text-4xl font-semibold">No pending tasks!</h1>
        <h2 className="text-lg">
          Click the {<FontAwesomeIcon icon={faPlus} />} to add a task!
        </h2>
      </div>
    );
  } else if (code === 404) {
    return (
      <div className="flex flex-col items-center gap-8 py-12">
        <FontAwesomeIcon icon={faFileCircleQuestion} className="text-8xl" />
        <h1 className="text-lg">Task not found!</h1>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          className="text-8xl font-semibold"
        />
        <div className="items-center flex flex-col gap-1">
          <h1 className="text-xl font-semibold">Server error</h1>
          <p className="text-md">Error Code: {code}</p>
        </div>
      </div>
    );
  }
}

export default ErrorController;
