import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function GamificationStatus({ points, level, badges }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-2">Kemajuan Anda</h3>
      <p>Mata: {points}</p>
      <p>Tahap: {level}</p>
      <Progress value={points % 100} className="w-full mt-2" />
      <div className="mt-4">
        <h4 className="font-semibold mb-2">Lencana:</h4>
        <div className="flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <Badge key={index} variant="secondary">
              {badge}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

