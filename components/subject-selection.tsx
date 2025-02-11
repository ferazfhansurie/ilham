import { Button } from "@/components/ui/button"

const subjects = [
  { id: "math", name: "Matematik" },
  { id: "science", name: "Sains" },
  { id: "english", name: "Bahasa Inggeris" },
  { id: "malay", name: "Bahasa Malaysia" },
]

export function SubjectSelection({ onSelectSubject }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {subjects.map((subject) => (
        <Button key={subject.id} onClick={() => onSelectSubject(subject.id)} variant="outline" className="h-24 text-lg">
          {subject.name}
        </Button>
      ))}
    </div>
  )
}

