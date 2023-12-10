import "./index.css";


interface BubbleProps {
  data: {
    name: string;
    message: string;
  };
}

export function Bubble({ data }: BubbleProps) {
  return (
    <div>
      <div className="">
        <p
          className={`text-base text-black font-bold ${
            data.name === "Robot" ? "text-left" : "text-right"
          } mx-10`}
        >
          {data.name}
        </p>
      </div>

      <div className={`bubble ${data.name === "Robot" ? "left" : "right"}`}>
        <div>
          <p> {data.message}</p>
        </div>
      </div>
    </div>
  );
}
