export function DecorativeDivider() {
  return (
    <div className="flex items-center justify-center gap-4 my-8 px-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="text-primary text-2xl">✨</div>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
    </div>
  )
}