import { DottedSurface } from "@/components/ui/dotted-surface";
import { cn } from "@/lib/utils";

export function DottedGradientBackground() {
    return (
        <DottedSurface className="size-full pointer-events-none fixed inset-0 -z-50">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                    aria-hidden="true"
                    className={cn(
                        'pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full',
                        'bg-[radial-gradient(ellipse_at_center,var(--color-foreground)/0.05,transparent_50%)]',
                        'blur-[30px]',
                    )}
                />
            </div>
        </DottedSurface>
    );
}
