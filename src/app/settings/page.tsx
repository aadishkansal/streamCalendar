"use client";
import React, { use, useEffect } from "react";
import MainNavbar from "../components/MainNavBar";
import {
  BellIcon,
  HelpCircleIcon,
  Settings2,
  ReceiptIndianRupeeIcon,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Shield,
  User2,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CreditCard,
  Download,
  FileText,
  Package,
  RefreshCw,
  Settings,
  Zap,
} from "lucide-react";
import Footer from "../components/Footer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { set } from "lodash";

const invoices = [
  {
    id: "INV-001",
    date: "Mar 1, 2024",
    amount: "$29.00",
    status: "Paid",
  },
  {
    id: "INV-002",
    date: "Feb 1, 2024",
    amount: "$29.00",
    status: "Paid",
  },
  {
    id: "INV-003",
    date: "Jan 1, 2024",
    amount: "$29.00",
    status: "Paid",
  },
];

interface FormData {
  name: string;
  email: string;
  password: string;
  notifications: {
    email: boolean;
    updates: boolean;
    marketing: boolean;
  };
}

const Setting = () => {
  const { data: session } = useSession();
  const [activeSection, setActiveSection] = useState("account");
  const [showMobileMenu, setShowMobileMenu] = useState(true);
  const [name, setName] = useState<string>(session?.user?.name || "");
  const router = useRouter();
  const { update } = useSession();
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: "",
    password: "",
    notifications: {
      email: false,
      updates: false,
      marketing: false,
    },
  });

  const settingsItems = [
    {
      id: "account",
      label: "Account",
      icon: User2,
    },
    {
      id: "privacy",
      label: "Privacy",
      icon: Shield,
    },
    {
      id: "billing",
      label: "Billing & Subscription",
      icon: ReceiptIndianRupeeIcon,
    },
    {
      id: "notification",
      label: "Notification",
      icon: BellIcon,
    },
    {
      id: "support",
      label: "Help & Support",
      icon: HelpCircleIcon,
    },
  ];

  const submitNewName = async () => {
    try {
      const res = await axios.put("/api/changeName", { name });
      await update({
        name: name,
      });
    } catch (error) {
      console.error("Error changing name", error);
    }
  };

  useEffect(() => {
    setName(session?.user?.name || "");
  }, [session?.user?.name]);

  const handleInputChange = (name: string) => {
    setName(name);
  };

  const handleNotificationChange = (
    type: keyof FormData["notifications"],
    value: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value,
      },
    }));
  };

  const deleteAccount = async () => {
    const response = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (response) {
      try {
        await axios.delete("/api/delete-user");
        await signOut({
          redirect: true,
          callbackUrl: "/",
        });
      } catch (error) {
        console.error("There was an error deleting the account!", error);
      }
    }
  };

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setShowMobileMenu(false);
  };

  const handleBackClick = () => {
    setShowMobileMenu(true);
  };

  const renderAccountContent = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-2xl">
        <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 pr-10"
            />
          </div>
          <button
            className="flex items-center space-x-2 px-4 font-semibold text-sm py-2 bg-gradient-to-r from-[#5d57ee] to-[#353188] font-['Inter'] text-white rounded-full hover:from-[#353188] hover:to-[#5d57ee] transition-colors"
            onClick={submitNewName}
          >
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 rounded-xl bg-white shadow-2xl border border-red-200">
        <p className="text-red-600 font-medium mb-4">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <button
          onClick={deleteAccount}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700 transition-colors"
        >
          <Trash2 size={16} />
          <span>Delete Account</span>
        </button>
      </div>
    </div>
  );

  const renderNotificationsContent = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-gray-600">
                Receive important updates via email
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifications.email}
                onChange={(e) =>
                  handleNotificationChange("email", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5d57ee]"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Push Notifications</h4>
              <p className="text-sm text-gray-600">
                Receive notifications in your browser
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifications.updates}
                onChange={(e) =>
                  handleNotificationChange("updates", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5d57ee]"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Marketing Emails</h4>
              <p className="text-sm text-gray-600">
                Receive product updates and promotions
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifications.marketing}
                onChange={(e) =>
                  handleNotificationChange("marketing", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5d57ee]"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBillingContent = () => (
    <div className="container mx-auto px-4 py-6 md:px-6 2xl:max-w-[1400px]">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row">
          <div>
            <p className="text-muted-foreground text-sm">
              Manage your subscription and billing details
            </p>
          </div>
        </div>

        <Card className="mb-8 p-0">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Package className="text-primary size-5" />
                  <h2 className="text-lg font-semibold">Pro Plan</h2>
                  <Badge className="border border-slate-300 rounded-xl">
                    Current Plan
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  $29/month • Renews on April 1, 2024
                </p>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="rounded-full hover:bg-[#5d57ee] hover:text-white flex-1 sm:flex-none"
                >
                  Change Plan
                </Button>
                <Button
                  variant="destructive"
                  className="rounded-full hover:bg-[#5d57ee] hover:text-white flex-1 sm:flex-none"
                >
                  Cancel Plan
                </Button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="text-primary size-4" />
                    <span className="text-sm font-medium">API Requests</span>
                  </div>
                  <span className="text-sm">8,543 / 10,000</span>
                </div>
                <Progress
                  value={85.43}
                  className="h-2 [&>div]:bg-[#5d57ee] border-slate-400 border"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="text-primary size-4" />
                    <span className="text-sm font-medium">Monthly Syncs</span>
                  </div>
                  <span className="text-sm">143 / 200</span>
                </div>
                <Progress
                  value={71.5}
                  className="h-2 [&>div]:bg-[#5d57ee] border-slate-400 border"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 p-0">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Payment Method</h2>
                <div className="flex items-center gap-2">
                  <CreditCard className="text-muted-foreground size-4" />
                  <span className="text-muted-foreground text-sm">
                    Visa ending in 4242
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                className="rounded-full hover:bg-[#5d57ee] hover:text-white w-full sm:w-auto"
              >
                Update Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardContent className="p-4 sm:p-6">
            <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row">
              <h2 className="text-lg font-semibold">Billing History</h2>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full hover:bg-[#5d57ee] hover:text-white w-full sm:w-auto"
              >
                <Download className="mr-2 size-4" />
                Download All
              </Button>
            </div>

            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex flex-col items-start justify-between gap-3 border-b py-3 last:border-0 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-muted rounded-md p-2">
                      <FileText className="text-muted-foreground size-4" />
                    </div>
                    <div>
                      <p className="font-medium">{invoice.id}</p>
                      <p className="text-muted-foreground text-sm">
                        {invoice.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <Badge variant="outline" className="rounded-xl font-normal">
                      {invoice.status}
                    </Badge>
                    <span className="font-medium">{invoice.amount}</span>
                    <Button variant="ghost" size="sm">
                      <Download className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSupportContent = () => (
    <div className="mx-auto max-w-lg">
      <div className="mb-10 text-center">
        <p className="text-muted-foreground">
          I'd love to hear from you. Please fill out the form below and I'll get
          back to you as soon as possible.
        </p>
      </div>

      <Card className="p-4 sm:p-6 border shadow-xl border-slate-200">
        <CardContent className="p-0">
          <form className="space-y-6">
            <div>
              <Label htmlFor="name" className="mb-2 block font-semibold">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                required
                className="rounded-xl border border-slate-400"
              />
            </div>

            <div>
              <Label htmlFor="email" className="mb-2 block font-semibold">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Your email address"
                required
                className="rounded-xl border border-slate-400"
              />
            </div>

            <div>
              <Label htmlFor="subject" className="mb-2 block font-semibold">
                Subject
              </Label>
              <Input
                id="subject"
                name="subject"
                placeholder="What's this regarding?"
                required
                className="rounded-xl border border-slate-400"
              />
            </div>

            <div>
              <Label htmlFor="message" className="mb-2 block font-semibold">
                Message
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Your message"
                required
                className="resize-none rounded-xl border border-slate-400"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-full text-white bg-gradient-to-r from-[#5d57ee] to-[#353188] transition-all duration-300 ease-in-out hover:from-[#353188] hover:to-[#5d57ee] hover:shadow-lg border-none outline-none font-semibold"
            >
              Send Message
            </Button>

            <p className="text-muted-foreground text-center text-sm">
              I'll respond to your message within 1-2 business days.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return renderAccountContent();
      case "notification":
        return renderNotificationsContent();
      case "billing":
        return renderBillingContent();
      case "support":
        return renderSupportContent();
      default:
        return (
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Coming Soon</h3>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        );
    }
  };

  const renderMobileMenuList = () => (
    <div className="space-y-2">
      {settingsItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => handleSectionClick(item.id)}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#5d57ee] bg-opacity-10 rounded-full flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#5d57ee]" />
              </div>
              <span className="font-medium text-gray-900">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="flex justify-center ml-2 w-full">
        <MainNavbar />
      </div>

      <div className="flex mt-16 sm:mt-24 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Layout */}
        <div className="hidden md:flex md:h-[640px] bg-gray-50 w-full">
          {/* Desktop Sidebar */}
          <div className="w-80 bg-slate-100 mb-10 border-r rounded-s-xl border-white flex flex-col">
            <div className="p-6 border-b border-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#5d57ee] rounded-full flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Settings
                  </h2>
                  <p className="text-sm text-gray-600">
                    Manage your preferences
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <nav className="p-4 space-y-2">
                {settingsItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                        isActive
                          ? "bg-violet-50 border-l-4 border-[#5d57ee]"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${isActive ? "text-[#5d57ee]" : "text-gray-500"}`}
                      />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Desktop Main Content */}
          <div className="flex-1 p-8 rounded-e-xl border-slate-100 mb-10 border overflow-y-auto">
            <div className="max-w-4xl">
              <h1 className="text-2xl font-semibold text-gray-900 mb-8">
                {settingsItems.find((item) => item.id === activeSection)?.label}
              </h1>
              {renderContent()}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden w-full">
          {showMobileMenu ? (
            // Mobile Menu List
            <div className="bg-gray-50 mt-8  min-h-[calc(100vh-8rem)] p-4">
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-[#5d57ee] rounded-full flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Settings
                    </h2>
                    <p className="text-sm text-gray-600">
                      Manage your preferences
                    </p>
                  </div>
                </div>
              </div>
              {renderMobileMenuList()}
            </div>
          ) : (
            // Mobile Content View
            <div className="bg-gray-50 min-h-[calc(100vh-8rem)]">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
                <div className="flex items-center mt-4 space-x-3">
                  <button
                    onClick={handleBackClick}
                    className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <h1 className="text-lg font-semibold text-gray-900">
                    {
                      settingsItems.find((item) => item.id === activeSection)
                        ?.label
                    }
                  </h1>
                </div>
              </div>
              <div className="p-4">{renderContent()}</div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full mt-8">
        <Footer />
      </div>
    </div>
  );
};

export default Setting;
