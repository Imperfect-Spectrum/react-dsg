type ButtonData = string[];

interface ButtonsGroupProps {
  data: ButtonData;
  buttonHandleSubmit: (buttonText: string) => void;
}
export function ButtonsGroup({ data, buttonHandleSubmit }: ButtonsGroupProps) {
  return (
    <div className="flex flex-wrap justify-center items-center gap-5 text-lg mx-auto">
      {data.map((button: string, index: number) => (
        <button
          key={index}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-lg px-5 py-2.5 text-center me-2 mb-2 animate-pulse"
          onClick={() => buttonHandleSubmit(button)}
        >
          {button}
        </button>
      ))}
    </div>
  );
}
