"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card"
import { evaluationCriteria } from "./student-feedback-data"
import { Label } from "../ui/label"

export type EvaluationFormSchema = z.infer<typeof formSchema>

type StudentEvaluationFormProps = {
    coordinatorName?: string
    position?: string
    companyName?: string
    address?: string
    internName?: string
    isLoading?: boolean
    onSubmit: (values: EvaluationFormSchema) => void
}

const ratingScale = [
    { value: "5", label: "Excellent" },
    { value: "4", label: "Very Satisfactory" },
    { value: "3", label: "Satisfactory" },
    { value: "2", label: "Unsatisfactory" },
    { value: "1", label: "Poor" },
    { value: "0", label: "Not Applicable" },
] as const

const ratingEnum = z.enum(
    ratingScale.map((r) => r.value) as [string, ...string[]]
)

const formSchema = z.object({
    coordinatorName: z.string().min(1, "Required"),
    position: z.string().min(1, "Required"),
    companyName: z.string().min(1, "Required"),
    address: z.string().optional(),
    internName: z.string().min(1, "Required"),
    ratings: z.record(
        z.string(),
        ratingEnum.optional().refine((val) => val !== undefined, {
            message: "Rating is required",
        })
    ),
    comments: z.string().optional(),
})

export default function StudentEvaluationForm({
    coordinatorName,
    position,
    companyName,
    address,
    internName,
    isLoading,
    onSubmit,
}: StudentEvaluationFormProps) {
    const form = useForm<EvaluationFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            coordinatorName: coordinatorName ?? "",
            position: position ?? "",
            companyName: companyName ?? "",
            address: address ?? "",
            internName: internName ?? "",
            ratings: {},
            comments: "",
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-12 gap-5">
                    <div className="col-span-12 lg:col-span-6">
                        <Card className="h-full">
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
                                                    {...field}
                                                    disabled={!!coordinatorName}
                                                    className={
                                                        coordinatorName &&
                                                        "disabled:opacity-100 disabled:cursor-not-allowed"
                                                    }
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
                                                    {...field}
                                                    disabled={!!position}
                                                    className={
                                                        position &&
                                                        "disabled:opacity-100 disabled:cursor-not-allowed"
                                                    }
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
                                                    {...field}
                                                    disabled={!!companyName}
                                                    className={
                                                        companyName &&
                                                        "disabled:opacity-100 disabled:cursor-not-allowed"
                                                    }
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
                                                    {...field}
                                                    disabled={!!address}
                                                    className={
                                                        address &&
                                                        "disabled:opacity-100"
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="col-span-12 lg:col-span-6">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Intern Info</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="internName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={!!internName}
                                                    className={
                                                        internName &&
                                                        "disabled:opacity-100 disabled:cursor-not-allowed"
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {evaluationCriteria.map((section, idx) => (
                        <div key={idx} className="col-span-12">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{section.section}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    {section.items.map((item) => (
                                        <FormField
                                            key={item.key}
                                            control={form.control}
                                            name={`ratings.${item.key}`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        {item.label}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            defaultValue={
                                                                field.value
                                                            }
                                                            className="flex flex-wrap gap-4"
                                                        >
                                                            {ratingScale.map(
                                                                (scale) => (
                                                                    <div
                                                                        key={
                                                                            scale.value
                                                                        }
                                                                        className="flex items-center gap-2"
                                                                    >
                                                                        <RadioGroupItem
                                                                            value={
                                                                                scale.value
                                                                            }
                                                                            id={`${item.key}-${scale.value}`}
                                                                        />
                                                                        <Label
                                                                            className="text-muted-foreground"
                                                                            htmlFor={`${item.key}-${scale.value}`}
                                                                        >
                                                                            {
                                                                                scale.label
                                                                            }
                                                                        </Label>
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
                        </div>
                    ))}

                    <div className="col-span-12 ">
                        <Card>
                            <CardHeader>
                                <CardTitle>Comments</CardTitle>
                                <CardDescription className="max-w-2xl">
                                    Provide any additional feedback or
                                    observations about the student’s
                                    performance, behavior, or areas for
                                    improvement.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="comments"
                                    render={({ field }) => (
                                        <FormItem className="max-w-2xl">
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="col-span-12 ">
                        <div className="flex justify-end gap-2">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Submitting..." : "Submit Review"}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    )
}
