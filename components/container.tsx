import { cn } from "@/lib/utils";

const Container = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={cn("max-w-screen mx-auto p-2 border-2 border-black", className)}>
            {children}
        </div>
    )
}

export default Container;