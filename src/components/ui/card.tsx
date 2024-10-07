import * as React from "react"
import { cn } from "../../lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> { }

const Card: React.FC<CardProps> = ({ className, ...props }) => (
    <div
        className={cn(
            "rounded-lg border bg-card text-card-foreground shadow-sm",
            className
        )}
        {...props}
    />
)

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> { }

const CardHeader: React.FC<CardHeaderProps> = ({ className, ...props }) => (
    <div
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
)

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> { }

const CardTitle: React.FC<CardTitleProps> = ({ className, ...props }) => (
    <h3
        className={cn(
            "text-2xl font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
)

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> { }

const CardDescription: React.FC<CardDescriptionProps> = ({ className, ...props }) => (
    <p
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
)

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> { }

const CardContent: React.FC<CardContentProps> = ({ className, ...props }) => (
    <div className={cn("p-6 pt-0", className)} {...props} />
)

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> { }

const CardFooter: React.FC<CardFooterProps> = ({ className, ...props }) => (
    <div
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
)

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }