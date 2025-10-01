export const violationTypes = [
    { value: "attendance", label: "Attendance" },
    { value: "academic", label: "Academic" },
    { value: "behavior", label: "Behavior" },
    { value: "dress_code", label: "Dress Code" },
    { value: "lateness", label: "Lateness" },
    { value: "unauthorized_absence", label: "Unauthorized Absence" },
    { value: "professionalism", label: "Professionalism / Attitude" },
    { value: "safety", label: "Safety Violation" },
    { value: "misconduct", label: "Misconduct" },
    { value: "other", label: "Other" },
]

export const violationTypeMap = Object.fromEntries(
    violationTypes.map((t) => [t.value, t.label])
)
