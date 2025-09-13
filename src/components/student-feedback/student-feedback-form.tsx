"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { evaluationCriteria } from "./student-feedback-data"

const ratingScale = ["5", "4", "3", "2", "1", "NA"] as const

const formSchema = z.object({
    coordinatorName: z.string().min(1, "Required"),
    position: z.string().min(1, "Required"),
    companyName: z.string().min(1, "Required"),
    address: z.string().min(1, "Required"),
    internName: z.string().min(1, "Required"),
    ratings: z.record(z.string(), z.enum(ratingScale)),
    comments: z.string().optional(),
})

export default function StudentEvaluationForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            coordinatorName: "",
            position: "",
            companyName: "",
            address: "",
            internName: "",
            ratings: {},
            comments: "",
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log("Form submitted:", values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Site Coordinator Info</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="coordinatorName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="position"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Position</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter position"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter company name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter address"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Intern Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="internName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Name of Intern to be Evaluated
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter intern's name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                {evaluationCriteria.map((section, idx) => (
                    <Card key={idx}>
                        <CardHeader>
                            <CardTitle>{section.section}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {section.items.map((item, i) => (
                                <FormField
                                    key={i}
                                    control={form.control}
                                    name={`ratings.${item}`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{item}</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                    className="flex gap-4"
                                                >
                                                    {ratingScale.map(
                                                        (value) => (
                                                            <div
                                                                key={value}
                                                                className="flex items-center gap-1"
                                                            >
                                                                <RadioGroupItem
                                                                    value={
                                                                        value
                                                                    }
                                                                    id={`${item}-${value}`}
                                                                />
                                                                <label
                                                                    htmlFor={`${item}-${value}`}
                                                                >
                                                                    {value}
                                                                </label>
                                                            </div>
                                                        )
                                                    )}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </CardContent>
                    </Card>
                ))}

                <Card>
                    <CardHeader>
                        <CardTitle>Comments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="comments"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Additional comments..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline">
                        Save Draft
                    </Button>
                    <Button type="submit">Submit Review</Button>
                </div>
            </form>
        </Form>
    )
}
