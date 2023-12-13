import "./App.css";
import { Bubble } from "./components/bubble";
import { ButtonData } from "./types";
import { ButtonsGroup } from "./components/buttonsGroup";
import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { IsLoadingSpin } from "./components/loadingSpin";

export type ButtonDataType = string[];

interface BubbleData {
  name: string;
  message: string;
}
interface ChatState {
  next_message: string;
  bubbleData: BubbleData;
  next_redirect: string | null;
  buttonData: string[];
  status: number;
  next_query: string;
}

async function fetchMessage(url: string | null, queryParams: string) {
  const data =
    url !== ""
      ? await axios.get(url + queryParams)
      : await axios.get("http://localhost:9999/api/input");

  return data.data;
}

function App() {
  const [chatState, setChatState] = useState<ChatState>({
    next_message: "",
    bubbleData: {
      name: "",
      message: "",
    },
    next_redirect: null,
    buttonData: [],
    status: 0,
    next_query: "",
  });

  const [bubbleDataArray, setBubbleDataArray] = useState<BubbleData[]>([]);
  const [buttonDataArray, setButtonDataArray] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedButton, setSelectedButton] = useState<string>("");

  const {
    data: fetchedData,
    error,
    isLoading,
    refetch,
  } = useQuery<ChatState, any>(
    "myQueryKey",
    () => fetchMessage(chatState.next_message, inputValue),
    {
      enabled: false,
    }
  );

  const addNewMessage = (message: string) => {
    const newMessage: BubbleData = { name: "You", message };
    setBubbleDataArray((prevData) => [...prevData, newMessage]);
    setInputValue("");
    setSelectedButton("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue !== "") {
      refetch();
      addNewMessage(inputValue);
      if (chatState?.next_redirect && chatState?.next_redirect !== "") {
        redirectToExternalSite(chatState.next_redirect);
      }

      if (chatState?.next_query && chatState?.next_query !== "") {
        fetch(chatState.next_query);
      }
    }
  };

  useEffect(() => {
    if (fetchedData) {
      setChatState((prevChatState) => ({
        ...prevChatState,
        bubbleData: {
          name: fetchedData.bubbleData.name || "",
          message: fetchedData.bubbleData.message || "",
        },
        next_redirect:
          fetchedData.next_redirect !== undefined
            ? fetchedData.next_redirect
            : prevChatState.next_redirect,
        next_message: fetchedData.next_message || prevChatState.next_message,
        buttonData: fetchedData.buttonData || prevChatState.buttonData,
      }));
      setBubbleDataArray((prevBubbleDataArray) => [
        ...prevBubbleDataArray,
        fetchedData.bubbleData,
      ]);
      setButtonDataArray(fetchedData.buttonData);
    }
  }, [fetchedData]);

  useEffect(() => {
    refetch();
  }, []);

  const buttonHandleSubmit = (value: string) => {
    setInputValue(() => value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const redirectToExternalSite = (link: string) => {
    const newLink = link + inputValue;
    window.open(newLink, "_blank", "noopener");
  };

  return (
    <div className="w-[500px] h-[100%] max-h-[600px] mx-auto ">
      <div className="bg-slate-100 text-black w-full  pt-2 relative pb-20 text-lg">
        <div className="flex flex-col gap-5 overflow-auto pb-6">
          {bubbleDataArray.length !== 0
            ? bubbleDataArray.map((data, index) => <Bubble data={data} />)
            : null}
        </div>
        <div className="flex flex-col justify-center items-center gap-5 text-lg mx-auto">
          {buttonDataArray.map((button: string, index: number) => (
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
