export function IsLoadingSpin() {
  return (
    <div className="flex items-center justify-start ml-5">
      <div className="px-3 py-1 text-xl font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
        Печатает...
      </div>
    </div>
  );
}
