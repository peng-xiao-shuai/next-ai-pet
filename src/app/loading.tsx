export default function LoadingRender({ className }: { className: string }) {
  return (
    <div
      className={`${className} h-[100vh] transition-all duration-300 flex items-center justify-center bg-[#fff7d5]`}
    >
      <div className="flex items-end font-bold text-[#7f6957]">
        <div className="flex items-end gap-1">
          Loading
          <span className="loading loading-dots size-10 text-[#7f6957]"></span>
        </div>
      </div>
    </div>
  );
}
