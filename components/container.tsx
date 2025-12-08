import { cn } from "@/lib/utils";

const Container = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={cn("max-w-screen mx-auto p-2", className)}>
            {children}
        </div>
    )
}

export default Container;