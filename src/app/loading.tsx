export default function LoadingRender() {
  return (
    <div
      className={`transition-all duration-300 h-full flex items-center justify-center`}
    >
      <div className="flex items-end font-bold text-white">
        <div className="flex items-end gap-1">
          Loading
          <span className="loading loading-dots size-10 text-white"></span>
        </div>
      </div>
    </div>
  );
}
