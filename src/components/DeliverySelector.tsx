import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DeliverySelectorProps {
  onContinue: (date: Date, time: string) => void;
}

const DeliverySelector = ({ onContinue }: DeliverySelectorProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const getNextDays = (count: number) => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < count; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const timeSlots = [
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  const formatDate = (date: Date) => {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
    };
  };

  const days = getNextDays(6);

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      onContinue(selectedDate, selectedTime);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
          Choose Your Delivery Date & Time
        </h1>

        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold text-foreground">Select Date</h2>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
            {days.map((day, index) => {
              const formatted = formatDate(day);
              const isSelected = selectedDate?.toDateString() === day.toDateString();
              return (
                <Card
                  key={index}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="text-center">
                    <div className="text-xs font-medium mb-1">{formatted.day}</div>
                    <div className="text-3xl font-bold mb-1">{formatted.date}</div>
                    <div className="text-xs font-medium">{formatted.month}</div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-foreground mb-4">Select Time</h2>
          <p className="text-sm text-muted-foreground mb-6">Times shown in Asia/Manila time</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            {timeSlots.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <Card
                  key={time}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedTime(time)}
                >
                  <div className="text-center text-lg font-semibold">{time}</div>
                </Card>
              );
            })}
          </div>
        </Card>

        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            className="px-12 py-6 text-lg"
            disabled={!selectedDate || !selectedTime}
            onClick={handleContinue}
          >
            Continue to Products
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeliverySelector;
