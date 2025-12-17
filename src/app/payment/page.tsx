"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

type PricingPlan = {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
};

const plans: PricingPlan[] = [
  {
    id: "weekly",
    name: "Weekly Access",
    price: 5,
    currency: "EUR",
    interval: "week",
    features: ["Unlimited messaging", "24/7 availability", "Voice messages", "Photo sharing"]
  },
  {
    id: "monthly",
    name: "Monthly Access",
    price: 12,
    currency: "EUR",
    interval: "month",
    features: ["Everything in Weekly", "Video calls", "Priority support", "Custom companion personality", "Save 52% vs weekly"]
  }
];

export default function PaymentPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>(plans[1]); // Default to monthly
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");
  const [companion, setCompanion] = useState<any>(null);
  const [paymentLink, setPaymentLink] = useState<string>("");
  const [showPaymentLink, setShowPaymentLink] = useState(false);

  useEffect(() => {
    // Load selected companion from localStorage
    const savedCompanion = localStorage.getItem("selectedCompanion");
    if (savedCompanion) {
      setCompanion(JSON.parse(savedCompanion));
    }
  }, []);

  const handleStripePayment = async () => {
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan.id,
          price: selectedPlan.price,
          interval: selectedPlan.interval,
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Payment failed. Please try again.");
    }
  };

  const generatePaymentLink = () => {
    // Generate a shareable payment link
    const link = `${window.location.origin}/payment?plan=${selectedPlan.id}&companion=${companion?.id || "default"}`;
    setPaymentLink(link);
    setShowPaymentLink(true);
  };

  const copyPaymentLink = () => {
    navigator.clipboard.writeText(paymentLink);
    alert("Payment link copied to clipboard!");
  };

  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "3.5rem", fontWeight: 900, textAlign: "center", color: "#ff66b3", marginBottom: "1rem" }}>
          Choose Your Plan
        </h1>
        
        {companion && (
          <div style={{ textAlign: "center", marginBottom: "2rem", padding: "1.5rem", background: "#222", borderRadius: "15px" }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>{companion.avatar}</div>
            <h3 style={{ fontSize: "1.8rem", color: "#ff66b3" }}>You selected: {companion.name}</h3>
            <p style={{ opacity: 0.8 }}>{companion.description}</p>
          </div>
        )}

        {/* Pricing Plans */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
          gap: "2rem",
          marginBottom: "3rem"
        }}>
          {plans.map(plan => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              style={{ 
                background: selectedPlan.id === plan.id ? "#ff66b3" : "#222", 
                color: selectedPlan.id === plan.id ? "#000" : "#fff",
                padding: "2.5rem", 
                borderRadius: "20px", 
                cursor: "pointer",
                border: selectedPlan.id === plan.id ? "3px solid #ff66b3" : "3px solid #333",
                transition: "all 0.3s ease",
                textAlign: "center"
              }}
            >
              <h3 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>{plan.name}</h3>
              <div style={{ fontSize: "3.5rem", fontWeight: "900", marginBottom: "0.5rem" }}>
                €{plan.price}
              </div>
              <div style={{ opacity: 0.8, marginBottom: "2rem" }}>per {plan.interval}</div>
              
              <div style={{ textAlign: "left", marginTop: "2rem" }}>
                {plan.features.map((feature, idx) => (
                  <div key={idx} style={{ marginBottom: "0.8rem", display: "flex", alignItems: "center" }}>
                    <span style={{ marginRight: "0.5rem" }}>✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Payment Method Selection */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "#ff66b3" }}>Choose Payment Method</h2>
          
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
            <button 
              onClick={() => setPaymentMethod("stripe")}
              style={{ 
                padding: "1rem 2.5rem", 
                background: paymentMethod === "stripe" ? "#ff66b3" : "#333", 
                color: paymentMethod === "stripe" ? "#000" : "#fff", 
                border: "none", 
                borderRadius: "30px", 
                fontWeight: "bold", 
                cursor: "pointer",
                fontSize: "1.1rem"
              }}>
              💳 Card (Stripe)
            </button>
            <button 
              onClick={() => setPaymentMethod("paypal")}
              style={{ 
                padding: "1rem 2.5rem", 
                background: paymentMethod === "paypal" ? "#ff66b3" : "#333", 
                color: paymentMethod === "paypal" ? "#000" : "#fff", 
                border: "none", 
                borderRadius: "30px", 
                fontWeight: "bold", 
                cursor: "pointer",
                fontSize: "1.1rem"
              }}>
              💰 PayPal
            </button>
          </div>

          {/* Payment Buttons */}
          <div style={{ maxWidth: "500px", margin: "0 auto" }}>
            {paymentMethod === "stripe" && (
              <button 
                onClick={handleStripePayment}
                style={{ 
                  width: "100%",
                  padding: "1.5rem", 
                  background: "#ff66b3", 
                  color: "#000", 
                  border: "none", 
                  borderRadius: "30px", 
                  fontWeight: "bold", 
                  cursor: "pointer",
                  fontSize: "1.3rem",
                  marginBottom: "1rem"
                }}>
                Pay €{selectedPlan.price} with Card
              </button>
            )}

            {paymentMethod === "paypal" && (
              <PayPalScriptProvider options={{ 
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
                currency: "EUR"
              }}>
                <PayPalButtons
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [{
                        amount: {
                          currency_code: "EUR",
                          value: selectedPlan.price.toString()
                        },
                        description: `${selectedPlan.name} - AI Companion Access`
                      }]
                    });
                  }}
                  onApprove={async (data, actions) => {
                    if (actions.order) {
                      const details = await actions.order.capture();
                      alert("Payment successful! Redirecting to your companion...");
                      router.push("/chat");
                    }
                  }}
                  onError={(err) => {
                    console.error("PayPal error:", err);
                    alert("Payment failed. Please try again.");
                  }}
                />
              </PayPalScriptProvider>
            )}
          </div>

          {/* Generate Payment Link */}
          <div style={{ marginTop: "3rem", padding: "2rem", background: "#222", borderRadius: "15px" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#ff66b3" }}>Share Payment Link</h3>
            <p style={{ opacity: 0.8, marginBottom: "1rem" }}>Generate a payment link to share with others</p>
            <button 
              onClick={generatePaymentLink}
              style={{ 
                padding: "1rem 2rem", 
                background: "#333", 
                color: "#fff", 
                border: "none", 
                borderRadius: "30px", 
                fontWeight: "bold", 
                cursor: "pointer",
                fontSize: "1rem",
                marginBottom: "1rem"
              }}>
              🔗 Generate Payment Link
            </button>

            {showPaymentLink && (
              <div style={{ marginTop: "1rem" }}>
                <input 
                  type="text" 
                  value={paymentLink} 
                  readOnly
                  style={{ 
                    width: "100%", 
                    padding: "1rem", 
                    borderRadius: "10px", 
                    border: "none", 
                    background: "#111", 
                    color: "#fff",
                    marginBottom: "0.5rem"
                  }}
                />
                <button 
                  onClick={copyPaymentLink}
                  style={{ 
                    padding: "0.8rem 2rem", 
                    background: "#ff66b3", 
                    color: "#000", 
                    border: "none", 
                    borderRadius: "30px", 
                    fontWeight: "bold", 
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}>
                  📋 Copy Link
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <button 
            onClick={() => router.push("/select")}
            style={{ 
              padding: "1rem 3rem", 
              background: "#333", 
              color: "#fff", 
              border: "none", 
              borderRadius: "30px", 
              fontWeight: "bold", 
              cursor: "pointer",
              fontSize: "1.1rem"
            }}>
            ← Back to Companions
          </button>
        </div>
      </div>
    </main>
  );
}
