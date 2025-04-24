"use client"

import type { FC } from "react"
import { cn } from "@/lib/utils"
import { DocumentTrackingModel } from "@/types/document"
import { formatDate } from "@/lib/utils/formatDate"

export interface DeliveryStep {
  id: string
  location: string
  timestamp?: string
  description?: string
}

interface DocumentTrackerProps {
  steps: DocumentTrackingModel[]
  currentStepIndex: number
  className?: string
}

const DocumentTracker: FC<DocumentTrackerProps> = ({ steps, currentStepIndex, className }) => {
  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <div className="space-y-0">
        {steps.map((step, index) => {
          // progress
          const isCompleted = step.status === "approved";
          const isRejected = step.status === "rejected";

          let isCurrent = false;
          let isFuture = false;

          const prevApproved = index === 0 || steps[index - 1].status === "approved";

          if (prevApproved) {
            isCurrent = !isCompleted;
          } else {
            isFuture = true;
          }

          let stepNote = ""

          // step note
          if (isCompleted || isRejected) {
            if (step.note) {
              stepNote = step.note
            } else {
              stepNote = "No note"
            }
          }

          return (
            <div key={step.id} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute left-4 top-6 w-0.5 h-full -ml-px",
                    isCompleted ? "bg-green-500" : "bg-gray-300",
                  )}
                />
              )}

              <div className="relative flex items-start group">
                {/* Circle */}
                <div
                  className={cn(
                    "flex items-center justify-center flex-shrink-0 w-8 h-8 mt-1 rounded-full",
                    isCompleted && "bg-green-500 text-white",
                    isCurrent && "bg-white border-2 border-green-500 ring-4 ring-green-100",
                    isFuture && "bg-gray-200",
                  )}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        isCurrent && "text-green-500",
                        isFuture && "text-gray-500",
                      )}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="ml-4 min-w-0 flex-1 pt-1 pb-8">
                  <h3
                    className={cn(
                      "text-sm font-medium",
                      isCompleted && "text-green-500",
                      isCurrent && "text-green-700 font-semibold",
                      isFuture && "text-gray-500",
                    )}
                  >
                    {step.user.name}
                  </h3>
                  {step.resolved_at && (
                    <p
                      className={cn(
                        "text-xs",
                        isCompleted && "text-green-600",
                        isCurrent && "text-green-600 font-medium",
                        isFuture && "text-gray-400",
                      )}
                    >
                      {formatDate(step.resolved_at)}
                    </p>
                  )}
                  <p
                    className={cn(
                      "mt-1 text-sm",
                      isCompleted && "text-green-600",
                      isCurrent && "text-gray-400",
                      isFuture && "text-gray-400",
                    )}
                  >
                    {stepNote}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DocumentTracker
