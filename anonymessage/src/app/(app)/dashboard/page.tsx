'use client';

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Message, User } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";

const UserDashboard = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const { toast } = useToast();

    const { data: session } = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
    });

    const { register, watch, setValue } = form;
    const acceptMessage = watch("acceptMessage");

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>("/api/acceptMessage");
            setValue("acceptMessage", response.data.isAcceptingMessage);
        } catch (error) {
            const axiosErrors = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosErrors.response?.data.message || "Failed to fetch message settings.",
                variant: "destructive",
            });
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue, toast]);

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        try {
            const response = await axios.get("/api/getMessages");
            setMessages(response.data.messages || []);
            if (refresh) {
                toast({
                    title: "Refreshed Messages",
                    description: "Showing latest messages.",
                });
            }
        } catch (error) {
            const axiosErrors = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosErrors.response?.data.message || "Unable to get messages.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [setIsLoading, setMessages, toast]);

    useEffect(() => {
        if (!session || !session.user) return;
        fetchMessages();
        fetchAcceptMessage();
    }, [session, fetchMessages, fetchAcceptMessage]);

    const handleDeleteMessage = (messageId: string) => {
        setMessages((prevMessages) => prevMessages.filter((message) => message._id !== messageId));
    };

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post("/api/acceptMessage", {
                acceptMessage: !acceptMessage,
            });
            setValue("acceptMessage", !acceptMessage);
            toast({
                title: response.data.message,
                description: "Success",
            });
        } catch (error) {
            const axiosErrors = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosErrors.response?.data.message || "Failed to update message settings.",
                variant: "destructive",
            });
        }
    };

    const { username } = session?.user || {} as User;
    const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';
    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast({
            title: "Copied to clipboard",
        });
    };

    if (!session || !session.user) {
        return <div className="text-4xl text-center font-bold mt-80">Please sign in.</div>;
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register('acceptMessage')}
                    checked={acceptMessage}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessage ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <MessageCard
                            key={message._id}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
