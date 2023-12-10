type ButtonData = string[];

export function ButtonsGroup({ data }: { data: ButtonData }) {
  return (
    <div className="flex flex-wrap items-center justify-around gap-5 text-lg mx-auto">
      {data.map((button: string, index: number) => (
        <button
          key={index}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-lg px-5 py-2.5 text-center me-2 mb-2 animate-pulse"
        >
          {button}
        </button>
      ))}
    </div>
  );
}
