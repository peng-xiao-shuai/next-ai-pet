export default function LoadingRender({ className }: { className: string }) {
  return (
    <div
      className={`${className} h-[100vh] transition-all duration-300 flex items-center justify-center bg-[#b36651]`}
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
