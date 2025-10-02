export const violationTypes = [
    { value: "attendance", label: "Attendance" },
    { value: "academic", label: "Academic" },
    { value: "behavior", label: "Behavior" },
    { value: "dress_code", label: "Dress code" },
    { value: "lateness", label: "Late" },
    { value: "unauthorized_absence", label: "Unauthorized absence" },
    { value: "professionalism", label: "Professionalism" },
    { value: "safety", label: "Safety violation" },
    { value: "misconduct", label: "Misconduct" },
    { value: "other", label: "Other" },
]

export const violationTypeMap = Object.fromEntries(
    violationTypes.map((t) => [t.value, t.label])
)
