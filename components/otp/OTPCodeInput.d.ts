export type OTPCodeInputProps = {
    length?: number;
    error?: string;
    onComplete: (code: string) => void;
}