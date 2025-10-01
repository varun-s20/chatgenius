import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CountrySelector } from "@/components/auth/CountrySelector";
import { OTPInput } from "@/components/auth/OTPInput";
import { useAuthStore } from "@/store/authStore";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { toast } from "sonner";

const phoneSchema = z.object({
  countryCode: z.string().min(1, "Please select a country code"),
  phone: z
    .string()
    .regex(/^\d+$/, "Phone number must contain only digits")
    .min(6, "Phone number must be at least 6 digits")
    .max(15, "Phone number is too long"),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;

export default function Auth() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [otp, setOtp] = useState("");
  const [phoneData, setPhoneData] = useState<PhoneFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      countryCode: "+91",
      phone: "",
    },
  });

  const onPhoneSubmit = async (data: PhoneFormValues) => {
    setIsLoading(true);
    setPhoneData(data);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("OTP sent successfully!");
    setStep("otp");
    setIsLoading(false);
  };

  const onOTPSubmit = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);

    // Simulate OTP verification
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (phoneData) {
      login({
        id: `user-${Date.now()}`,
        phone: phoneData.phone,
        countryCode: phoneData.countryCode,
      });
      toast.success("Login successful!");
      navigate("/dashboard");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-accent">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center">
          <div className="rounded-full mx-auto mb-4 shadow-card flex items-center justify-center text-white">
            <img src="favicon.png" alt="Logo" className="h-32" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Welcome to ChatGenius
          </CardTitle>
          <CardDescription>
            {step === "phone"
              ? "Enter your phone number to get started"
              : "Enter the OTP sent to your phone"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "phone" ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onPhoneSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country Code</FormLabel>
                      <FormControl>
                        <CountrySelector
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="Enter your phone number"
                          className="text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full gradient-primary text-white shadow-glow"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center">
                <OTPInput value={otp} onChange={setOtp} />
              </div>
              <div className="space-y-2">
                <Button
                  onClick={onOTPSubmit}
                  className="w-full gradient-primary text-white shadow-glow"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                  }}
                  disabled={isLoading}
                >
                  Back to phone number
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
