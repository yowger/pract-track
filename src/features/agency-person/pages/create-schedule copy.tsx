// import {
//     CalendarProps,
//     DayPilot,
//     DayPilotCalendar,
//     DayPilotNavigator,
// } from "@daypilot/daypilot-lite-react"
// import { useEffect, useState } from "react"

// export default function CreateSchedule() {
//     const [calendar, setCalendar] = useState<DayPilot.Calendar | null>(null)
//     const [startDate, setStartDate] = useState(new DayPilot.Date())
//     const [events, setEvents] = useState<DayPilot.EventData[]>([])

//     const config: Readonly<CalendarProps> = {
//         viewType: "Week",
//         timeRangeSelectedHandling: "Enabled",
//         onTimeRangeSelected: async (args) => {
//             if (!calendar) return

//             const modal = await DayPilot.Modal.prompt(
//                 "Create a new event:",
//                 "Event 1"
//             )

//             calendar.clearSelection()

//             if (!modal.result) {
//                 return
//             }

//             calendar.events.add({
//                 start: args.start,
//                 end: args.end,
//                 id: DayPilot.guid(),
//                 text: modal.result,
//             })
//         },
//         onEventClick: async (args) => {
//             await editEvent(args.e)
//         },
//         contextMenu: new DayPilot.Menu({
//             items: [
//                 {
//                     text: "Delete",
//                     onClick: async (args) => {
//                         calendar?.events.remove(args.source)
//                     },
//                 },
//                 {
//                     text: "-",
//                 },
//                 {
//                     text: "Edit...",
//                     onClick: async (args) => {
//                         await editEvent(args.source)
//                     },
//                 },
//             ],
//         }),
//         onBeforeEventRender: (args) => {
//             if (!calendar) return

//             args.data.areas = [
//                 {
//                     top: 3,
//                     right: 3,
//                     width: 20,
//                     height: 20,
//                     symbol: "icons/daypilot.svg#minichevron-down-2",
//                     fontColor: "#fff",
//                     toolTip: "Show context menu",
//                     action: "ContextMenu",
//                 },
//                 {
//                     top: 3,
//                     right: 25,
//                     width: 20,
//                     height: 20,
//                     symbol: "icons/daypilot.svg#x-circle",
//                     fontColor: "#fff",
//                     action: "None",
//                     toolTip: "Delete event",
//                     onClick: async (args) => {
//                         calendar.events.remove(args.source)
//                     },
//                 },
//             ]

//             const participants = args.data.participants
//             if (participants > 0) {
//                 // show one icon for each participant
//                 for (let i = 0; i < participants; i++) {
//                     args.data.areas.push({
//                         bottom: 5,
//                         right: 5 + i * 30,
//                         width: 24,
//                         height: 24,
//                         action: "None",
//                         image: `https://picsum.photos/24/24?random=${i}`,
//                         style: "border-radius: 50%; border: 2px solid #fff; overflow: hidden;",
//                     })
//                 }
//             }
//         },
//     }

//     const editEvent = async (event: DayPilot.Event) => {
//         if (!calendar) return

//         const modal = await DayPilot.Modal.prompt(
//             "Update event text:",
//             event.text()
//         )

//         if (!modal.result) {
//             return
//         }

//         event.data.text = modal.result
//         calendar.events.update(event)
//     }

//     useEffect(() => {
//         const events = [
//             {
//                 id: 1,
//                 text: "Event 1",
//                 start: "2025-10-06T10:30:00",
//                 end: "2025-10-06T13:00:00",
//                 participants: 2,
//             },
//             {
//                 id: 2,
//                 text: "Event 2",
//                 start: "2025-10-07T09:30:00",
//                 end: "2025-10-07T11:30:00",
//                 backColor: "#6aa84f",
//                 participants: 1,
//             },
//             {
//                 id: 3,
//                 text: "Event 3",
//                 start: "2025-10-07T12:00:00",
//                 end: "2025-10-07T15:00:00",
//                 backColor: "#f1c232",
//                 participants: 3,
//             },
//             {
//                 id: 4,
//                 text: "Event 4",
//                 start: "2025-10-05T11:30:00",
//                 end: "2025-10-05T14:30:00",
//                 backColor: "#cc4125",
//                 participants: 4,
//             },
//         ]

//         setEvents(events)
//     }, [])

//     return (
//         <div className="space-y-8 p-6">
//             <div className="flex">
//                 <div className="mr-2.5">
//                     <DayPilotNavigator
//                         selectMode={"Week"}
//                         showMonths={3}
//                         selectionDay={startDate}
//                         onTimeRangeSelected={(args) => {
//                             setStartDate(args.day)
//                         }}
//                         onBeforeCellRender={(args) => {
//                             const hasEvent = events.some(
//                                 (event) =>
//                                     new DayPilot.Date(
//                                         event.start
//                                     ).getDatePart() === args.cell.day
//                             )

//                             if (hasEvent) {
//                                 args.cell.html = `<div class="cell-highlight">${args.cell.html}</div>`
//                             } else {
//                                 args.cell.cssClass = ""
//                             }
//                         }}
//                     />
//                 </div>

//                 <div className="grow">
//                     <DayPilotCalendar
//                         {...config}
//                         startDate={startDate}
//                         events={events}
//                         controlRef={setCalendar}
//                     />
//                 </div>
//             </div>
//         </div>
//     )
// }
