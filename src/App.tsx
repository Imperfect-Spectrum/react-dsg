import "./App.css";
import { Bubble } from "./components/bubble";
import { BubbleData, ButtonData } from "./types";
import { ButtonsGroup } from "./components/buttonsGroup";
import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { IsLoadingSpin } from "./components/loadingSpin";

export interface BubbleDataInterface {
  name: string;
  message: string;
}

export type ButtonDataType = string[];

export interface ApiResponse {
  bubbleData: BubbleDataInterface;
  buttonData: ButtonDataType;
  status: number;
}

const buildApiEndpoint = (resource: string) => {
  return `${resource}`;
};

const fetchFirstData = async () => {
  const endpoint = buildApiEndpoint("http://localhost:9999/api/menu");
  const response = await axios.get(endpoint);
  return response.data;
};

const fetchMainData = async () => {
  const endpoint = buildApiEndpoint("http://localhost:9999/api/menu");
  const response = await axios.get(endpoint);
  return response.data;
};

function App() {
  const oneArr = [
    "http://localhost:9999/api/validation?q=",
    "http://localhost:9999/api/find_data/validation?q=",
    "http://localhost:9999/api/find_data/message/repeat/",
  ];
  const {
    data: firstData,
    isLoading: firstDataLoading,
    isError: firstDataError,
  } = useQuery("firstQuery", fetchFirstData, {
    initialData: () => {
      const initialData = fetchFirstData();
      return initialData;
    },
  });

  const {
    data: mainData,
    isLoading: mainDataLoading,
    isError: mainDataError,
  } = useQuery("mainQuery", () => fetchMainData());

  useEffect(() => {
    if (firstData) {
      setButtonData(firstData.buttonData || []);
      if (firstData.bubbleData) {
        const { name, message } = firstData.bubbleData;
        const initialBubbleData: BubbleData = { name, message };
        setBubbleDataArray([initialBubbleData]);
      }
    }
  }, [firstData]);

  const [buttonData, setButtonData] = useState<ButtonData[]>([]);

  const [bubbleDataArray, setBubbleDataArray] = useState<BubbleData[]>([]);

  const [inputValue, setInputValue] = useState<string>("");

  const addNewMessage = (message: string) => {
    const newMessage: BubbleData = { name: "You", message };
    setBubbleDataArray((prevData) => [...prevData, newMessage]);
    setInputValue("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue !== "") {
      addNewMessage(inputValue);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  if (firstDataError || mainDataError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="w-[500px] h-[100%] max-h-[600px] mx-auto bg-red-600">
      <div className="bg-slate-200 text-black w-full  pt-2 relative pb-20 text-lg">
        <div className="flex flex-col gap-5 overflow-auto pb-6">
          {bubbleDataArray.length !== 0
            ? bubbleDataArray.map((data, index) => <Bubble data={data} />)
            : null}
        </div>
        {firstDataLoading || mainDataLoading ? (
          <div className="mr-auto">
            <IsLoadingSpin />
          </div>
        ) : null}
        {buttonData.length !== 0 ? <ButtonsGroup data={buttonData} /> : null}
        <form onSubmit={handleSubmit}>
          <div className="absolute bottom-0 w-[100%] px-5 pb-2">
            <input
              type="text"
              className="w-full mx-auto bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 text-xl"
              placeholder="Message"
              value={inputValue}
              onChange={handleChange}
              required
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
