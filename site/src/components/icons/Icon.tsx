// One drawn icon family: 24px grid, 1.5 stroke, round caps — used instead of unicode glyphs.
type Name = 'arrow-up-right' | 'arrow-down' | 'chevron-down' | 'mail' | 'message' | 'send' | 'at' | 'link'
const paths: Record<Name, string> = {
  'arrow-up-right': 'M7 17 17 7M8 7h9v9',
  'arrow-down': 'M12 5v14M6 13l6 6 6-6',
  'chevron-down': 'm6 9 6 6 6-6',
  mail: 'M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11ZM3.5 6l8.5 7 8.5-7',
  message: 'M4 5h16v11H9l-5 4V5Z',
  send: 'M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z',
  at: 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm0 0v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
}
export default function Icon({ name, className = 'size-4' }: { name: Name; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={paths[name]} />
    </svg>
  )
}
