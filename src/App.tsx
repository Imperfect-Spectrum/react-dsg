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

const buildApiEndpoint = (resource: string) => {
  return `${resource}`;
};

const fetchFirstData = async () => {
  const endpoint = buildApiEndpoint("http://localhost:9999/api/input");
  const response = await axios.get(endpoint);
  return response.data;
};

function App() {
  const [nextMessage, setNextMessage] = useState<string | null>(null);
  const [buttonData, setButtonData] = useState<ButtonData[]>([]);
  const [bubbleDataArray, setBubbleDataArray] = useState<BubbleData[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedButton, setSelectedButton] = useState<string>("");
  const [loadingOldData, setLoadingOldData] = useState(false);
  const [loadingNewData, setLoadingNewData] = useState(false);

  useEffect(() => {
    localStorage.setItem("buttonData", JSON.stringify(buttonData));
  }, [buttonData]);
  useEffect(() => {
    localStorage.setItem("bubbleData", JSON.stringify(bubbleDataArray));
  }, [bubbleDataArray]);
  useEffect(() => {
    localStorage.setItem("inputValue", inputValue);
  }, [inputValue]);

  useEffect(() => {
    const retrievedButtonDataString = localStorage.getItem("buttonData");
    const retrievedBubbleDataString = localStorage.getItem("bubbleData");
    const retrievedInputValue = localStorage.getItem("inputValue");

    if (retrievedButtonDataString !== null) {
      const retrievedButtonData = JSON.parse(retrievedButtonDataString);
      console.log("Retrieved Button Data:", retrievedButtonData);
      // Можете использовать установку состояния setButtonData(retrievedButtonData);
    } else {
      console.log("Button Data not found in localStorage");
    }

    if (retrievedBubbleDataString !== null) {
      const retrievedBubbleData = JSON.parse(retrievedBubbleDataString);
      console.log("Retrieved Bubble Data:", retrievedBubbleData);
      // Можете использовать установку состояния setBubbleDataArray(retrievedBubbleData);
    } else {
      console.log("Bubble Data not found in localStorage");
    }

    if (retrievedInputValue !== null  ) {
      console.log("Retrieved Input Value:", retrievedInputValue);
      // Можете использовать установку состояния setInputValue(retrievedInputValue);
    } else {
      console.log("Input Value not found in localStorage");
    }
  }, []);

  const {
    data: secondData,
    isLoading: secondDataLoading,
    isError: secondDataError,
    refetch: refetchSecondData,
  } = useQuery(
    "secondQuery",
    async () => {
      if (inputValue !== "") {
        const combinedMessage = nextMessage
          ? `${nextMessage}${inputValue}`
          : inputValue;

        const response = await axios.get(buildApiEndpoint(combinedMessage));
        return response.data;
      }
      if (selectedButton !== "") {
        const combinedMessage = nextMessage
          ? `${nextMessage}${selectedButton}`
          : selectedButton;

        const response = await axios.get(buildApiEndpoint(combinedMessage));
        return response.data;
      }
    },
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (secondData) {
      setButtonData(secondData.buttonData || []);

      if (secondData.bubbleData) {
        const { name, message } = secondData.bubbleData;
        const newBubbleData: BubbleData = { name, message };
        setBubbleDataArray((prevData) => [...prevData, newBubbleData]);
      }

      setNextMessage(secondData.next_message || null);
    }
  }, [secondData]);

  const {
    data: firstData,
    isLoading: firstDataLoading,
    isError: firstDataError,
  } = useQuery("firstQuery", fetchFirstData);

  // useEffect(() => {
  //   setInputValue(selectedButton);
  //   refetchSecondData();
  //   addNewMessage(selectedButton);
  // }, [selectedButton]);

  const addNewMessage = (message: string) => {
    const newMessage: BubbleData = { name: "You", message };
    setBubbleDataArray((prevData) => [...prevData, newMessage]);
    setInputValue("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue !== "") {
      refetchSecondData();
      addNewMessage(inputValue);
      if (secondData?.next_redirect && secondData?.next_redirect !== "") {
        redirectToExternalSite(secondData.next_redirect);
      }
    }
  };

  const buttonHandleSubmit = (value: string) => {
    setSelectedButton(value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const redirectToExternalSite = (link: string) => {
    const newWindow = window.open(link, "_blank");
    if (newWindow) {
      newWindow.opener = null; // отключение связи с родительским окном
    }
  };

  useEffect(() => {
    if (firstData) {
      setButtonData(firstData.buttonData || []);
      if (firstData.bubbleData) {
        const { name, message } = firstData.bubbleData;
        const initialBubbleData: BubbleData = { name, message };
        setBubbleDataArray([initialBubbleData]);
      }
      setNextMessage(firstData.next_message || null);
    }
    refetchSecondData();
  }, [loadingNewData]);

  if (firstDataError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="w-[500px] h-[100%] max-h-[600px] mx-auto ">
      <div className="flex  gap-9">
        {}
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => setLoadingOldData(!loadingOldData)}
        >
          Загрузить новый чат
        </button>
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => setLoadingNewData(!loadingNewData)}
        >
          Восстановить старый чат
        </button>
      </div>

      <div className="bg-slate-100 text-black w-full  pt-2 relative pb-20 text-lg">
        <div className="flex flex-col gap-5 overflow-auto pb-6">
          {bubbleDataArray.length !== 0
            ? bubbleDataArray.map((data, index) => <Bubble data={data} />)
            : null}
        </div>
        {firstDataLoading ? (
          <div className="mr-auto">
            <IsLoadingSpin />
          </div>
        ) : null}
        {buttonData.length !== 0 ? (
          <ButtonsGroup
            data={buttonData}
            buttonHandleSubmit={buttonHandleSubmit}
          />
        ) : null}

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
