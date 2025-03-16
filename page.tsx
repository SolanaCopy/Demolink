"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import Link from "next/link";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Drawer,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PaymentIcon from "@mui/icons-material/Payment";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Image from "next/image";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

// Icons for "How It Works" section
import FileCopyIcon from "@mui/icons-material/FileCopy";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

// Icon voor trade geopend
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// React Slick en slick-carousel CSS (indien nodig)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// ChartJS en Line component (indien nodig)
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Socket.IO verbinding
const socket = io("http://localhost:4000", { transports: ["websocket"] });

// Hulpfunctie om een wallet-adres in te korten
const truncateWallet = (wallet: string) =>
  wallet ? wallet.slice(0, 6) + "..." + wallet.slice(-4) : "";

// Navbar-knoppen met transparante achtergrond in de unhover-state
const navbarButtonStyle = {
  background: "transparent",
  color: "#fff",
  fontWeight: "bold",
  textTransform: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    background: "linear-gradient(90deg, #C0C0C0, #A9A9A9, #C0C0C0)",
    color: "#fff",
    transform: "scale(1.05)"
  }
};

const buttonStyle = {
  background: "linear-gradient(45deg, #00FFC6, #00B8FF)",
  color: "#fff",
  fontWeight: "bold",
  textTransform: "none",
  textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
  boxShadow: "0px 4px 15px rgba(0,224,255,0.5)",
  transition: "all 0.3s ease-in-out",
  padding: "6px 12px",
  borderRadius: "8px",
  "&:hover": {
    background: "linear-gradient(45deg, #00B8FF, #00FFC6)",
    transform: "scale(1.05)"
  }
};

const followButtonStyle = { ...buttonStyle, minWidth: "200px" };

// Theme definitie
const theme = createTheme({
  typography: {
    fontFamily: "'Roboto', sans-serif",
    fontWeightBold: 700
  },
  palette: {
    primary: { main: "#00E0FF" },
    secondary: { main: "#00FFC6" },
    background: { default: "#121212" },
    text: { primary: "#ffffff" }
  }
});

/* ------------------------- ParticlesBackground Component ------------------------- */
const ParticlesBackground = () => {
  const particlesInit = async (main: any) => {
    await loadFull(main);
  };
  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: { color: { value: "#121212" } },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: { enable: true, mode: "push" },
            onHover: { enable: true, mode: "grab" },
            resize: true
          },
          modes: { push: { quantity: 4 }, grab: { distance: 140, links: { opacity: 1 } } }
        },
        particles: {
          color: { value: "#00FFC6" },
          links: { color: "#00E0FF", distance: 150, enable: true, opacity: 0.6, width: 1 },
          collisions: { enable: false },
          move: { direction: "none", enable: true, outModes: { default: "out" }, random: false, speed: 2, straight: false },
          number: { density: { enable: true, area: 800 }, value: 100 },
          opacity: { value: 0.5 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 3 } }
        },
        detectRetina: true
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1
      }}
    />
  );
};

/* ------------------------- Navbar Component ------------------------- */
const Navbar = ({ onNotifOpen }: { onNotifOpen: () => void }) => {
  const navItems = [
    { label: "Homepage", path: "/" },
    { label: "Account", path: "/account" },
    { label: "Traders", path: "/traders" }, // Toegevoegd: Traders knop
    { label: "Strategy Provider", path: "/strategy-provider" },
    { label: "Strategy", path: "/strategy" },
    { label: "Leaderboard", path: "/leaderboard" },
    { label: "Community Chat", path: "/community-chat" }
  ];
  const router = useRouter();
  return (
    <AppBar
      position="static"
      sx={{
        background: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(15px)",
        boxShadow: "0px 4px 15px rgba(0,0,0,0.7)"
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/trading-logo.png"
            alt="Trading Logo"
            width={80}
            height={80}
            style={{ marginRight: "10px" }}
          />
        </Box>
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", gap: 2 }}>
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} passHref>
              <Button sx={{ ...navbarButtonStyle, fontSize: "0.85rem" }}>
                {item.label}
              </Button>
            </Link>
          ))}
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton sx={{ color: "#00FFC6", zIndex: 150 }} onClick={onNotifOpen}>
            <NotificationsIcon />
          </IconButton>
          <Button
            sx={{ ...navbarButtonStyle, fontSize: "0.85rem" }}
            onClick={() => router.push("/account")}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

/* ------------------------- CardSlider Component ------------------------- */
function CardSlider() {
  const slides = [
    {
      title: "Professional Trading",
      description:
        "Experience the benefits of professional trading via PancakeSwap Futures, with advanced risk management to maximize your profit potential while minimizing risks.",
      icon: <TrendingUpIcon sx={{ fontSize: 50, color: "#00FFC6" }} />
    },
    {
      title: "Automated Profit Reinvestment",
      description:
        "Your profits are automatically reinvested using Chainlink VRF, ensuring consistent portfolio growth without additional effort.",
      icon: <TrendingUpIcon sx={{ fontSize: 50, color: "#00FFC6" }} />
    },
    {
      title: "Safe & Transparent",
      description:
        "All transactions are recorded on-chain and verified, so you can rely on complete transparency and security for your investments.",
      icon: <TrendingUpIcon sx={{ fontSize: 50, color: "#00FFC6" }} />
    },
    {
      title: "Effortless Passive Income",
      description:
        "Discover the power of passive income without prior trading experience. Deposit USDT and let our advanced system work for you.",
      icon: <TrendingUpIcon sx={{ fontSize: 50, color: "#00FFC6" }} />
    },
    {
      title: "Exclusive VIP Discounts",
      description:
        "The greater your investment, the more you save. Benefit from exclusive discounts of up to 10% and optimize your returns.",
      icon: <TrendingUpIcon sx={{ fontSize: 50, color: "#00FFC6" }} />
    },
    {
      title: "Attractive Referral Rewards",
      description:
        "Refer friends and earn up to 20% of the trading fees they generate. Build an additional income stream while expanding your network.",
      icon: <TrendingUpIcon sx={{ fontSize: 50, color: "#00FFC6" }} />
    },
    {
      title: "Withdraw Anytime – Full Control",
      description:
        "Maintain complete control over your finances. Withdraw your profits at any time, with no restrictions or hidden fees.",
      icon: <TrendingUpIcon sx={{ fontSize: 50, color: "#00FFC6" }} />
    },
    {
      title: "Real-Time Price Validation",
      description:
        "Our trades are validated using advanced Chainlink Oracles, ensuring you always have access to the most accurate pricing data.",
      icon: <TrendingUpIcon sx={{ fontSize: 50, color: "#00FFC6" }} />
    },
    {
      title: "Intelligent Risk Management",
      description:
        "Benefit from built-in Stop-Loss and Take-Profit mechanisms, specifically designed to protect your capital in any market condition.",
      icon: <TrendingUpIcon sx={{ fontSize: 50, color: "#00FFC6" }} />
    },
    {
      title: "Start Trading & Earning Today",
      description:
        "Join Secure Trading Vault and experience the future of trading. Deposit USDT and start generating passive income in a professional manner immediately.",
      icon: <TrendingUpIcon sx={{ fontSize: 50, color: "#00FFC6" }} />
    }
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <Box sx={{ position: "relative", overflow: "hidden", width: "100%", height: "400px" }}>
      {slides.map((slide, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            top: 0,
            left: `${(index - currentSlide) * 100}%`,
            width: "100%",
            height: "100%",
            background: "rgba(255, 255, 255, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(15px)",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            transition: "left 0.5s ease-in-out",
            padding: 2,
            borderRadius: "20px",
            boxShadow: "0px 12px 30px rgba(0,0,0,0.7)"
          }}
        >
          {slide.icon}
          <Typography variant="h4" sx={{ fontWeight: 900, mt: 1 }}>
            {slide.title}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, maxWidth: "80%", textAlign: "center", fontWeight: 700 }}>
            {slide.description}
          </Typography>
        </Box>
      ))}
      <Button
        onClick={prevSlide}
        sx={{
          position: "absolute",
          top: "50%",
          left: "10px",
          transform: "translateY(-50%)",
          background: "none",
          boxShadow: "none",
          color: "#00FFC6",
          fontSize: "2rem",
          minWidth: "auto",
          zIndex: 2,
          "&:hover": { background: "none", color: "#00B8FF" }
        }}
      >
        &#10094;
      </Button>
      <Button
        onClick={nextSlide}
        sx={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
          background: "none",
          boxShadow: "none",
          color: "#00FFC6",
          fontSize: "2rem",
          minWidth: "auto",
          zIndex: 2,
          "&:hover": { background: "none", color: "#00B8FF" }
        }}
      >
        &#10095;
      </Button>
    </Box>
  );
}

/* ------------------------- NotificationContent Component ------------------------- */
const NotificationContent = ({
  notifications,
  notificationsEnabled,
  handleToggleNotifications,
  userWallet
}: {
  notifications: any[];
  notificationsEnabled: boolean;
  handleToggleNotifications: (e: any) => void;
  userWallet: string;
}) => {
  const getNotificationIcon = (notif: any) => {
    switch (notif.type) {
      case "deposit":
        return <PaymentIcon sx={{ color: "#00FFC6", mr: 1 }} />;
      case "withdrawal":
        return <MoneyOffIcon sx={{ color: "#FF4C4C", mr: 1 }} />;
      case "profitClaim":
        return <AttachMoneyIcon sx={{ color: "#FFD700", mr: 1 }} />;
      case "tradeOpened":
        return <PlayCircleOutlineIcon sx={{ color: "#00FFC6", mr: 1 }} />;
      case "tradeClosedProfit":
        return <AttachMoneyIcon sx={{ color: "#FFD700", mr: 1 }} />;
      case "tradeClosedLoss":
        return <MoneyOffIcon sx={{ color: "#FF4C4C", mr: 1 }} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Notifications
      </Typography>
      <FormControlLabel
        control={<Switch checked={notificationsEnabled} onChange={handleToggleNotifications} color="secondary" />}
        label={notificationsEnabled ? "On" : "Off"}
        sx={{ mb: 2, color: "#fff" }}
      />
      {notificationsEnabled ? (
        <List
          sx={{
            overflowY: "auto",
            flexGrow: 1,
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": { backgroundColor: "#00FFC6", borderRadius: "3px" }
          }}
        >
          {notifications.map((notif) => (
            <React.Fragment key={notif.id}>
              <ListItem alignItems="center">
                {getNotificationIcon(notif)}
                <ListItemText
                  sx={{ ml: 2 }}
                  primary={truncateWallet(userWallet)}
                  secondary={notif.message}
                  primaryTypographyProps={{ fontWeight: "bold", color: "#fff" }}
                  secondaryTypographyProps={{ color: "#ccc" }}
                />
              </ListItem>
              <Divider variant="inset" component="li" sx={{ backgroundColor: "#333" }} />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexGrow: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            Notifications are disabled
          </Typography>
          <Typography variant="body2" sx={{ color: "#ccc" }}>
            Turn them on to receive updates
          </Typography>
        </Box>
      )}
    </Box>
  );
};

/* ------------------------- HomePage Component ------------------------- */
export default function HomePage() {
  const router = useRouter();

  // Dummy wallet van de ingelogde gebruiker
  const [userWallet, setUserWallet] = useState("0x123456789abcdef");

  // Notificaties bevatten een wallet-eigenschap
  const [notifications, setNotifications] = useState([
    { id: 1, trader: "Trader ABC", wallet: "0x123456789abcdef", type: "profitClaim", message: "Claimed profit of $200" },
    { id: 2, trader: "Trader XYZ", wallet: "0x123456789abcdef", type: "deposit", message: "Deposited $500 to your account" },
    { id: 3, trader: "Trader LMN", wallet: "0x123456789abcdef", type: "withdrawal", message: "Withdrew $300 from your account" },
    { id: 8, trader: "Trader ABC", wallet: "0x123456789abcdef", type: "tradeOpened", message: "A new trade has been opened for your investment." },
    { id: 9, trader: "Trader ABC", wallet: "0x123456789abcdef", type: "tradeClosedProfit", message: "A trade has closed with profit on your investment." },
    { id: 10, trader: "Trader ABC", wallet: "0x123456789abcdef", type: "tradeClosedLoss", message: "A trade has closed with a loss on your investment." },
    // Badge-notificaties worden niet getoond
    { id: 4, trader: "Trader DEF", wallet: "0x123456789abcdef", type: "badge", badge: "Gold", message: "Received a Gold badge" }
  ]);

  // Filter notificaties: alleen meldingen voor de ingelogde gebruiker en geen badges
  const filteredNotifications = notifications.filter(
    (notif) => notif.wallet === userWallet && notif.type !== "badge"
  );

  const [notifOpen, setNotifOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected with id:", socket.id);
    });
    socket.on("onlineUsers", (count) => {
      // Update online users indien gewenst
    });
    return () => {
      socket.off("connect");
      socket.off("onlineUsers");
    };
  }, []);

  useEffect(() => {
    const storedValue = localStorage.getItem("notificationsEnabled");
    if (storedValue !== null) {
      setNotificationsEnabled(JSON.parse(storedValue));
    }
  }, []);

  const handleNotifOpen = () => setNotifOpen(true);
  const handleNotifClose = () => setNotifOpen(false);
  const handleToggleNotifications = (e: any) => {
    const newValue = e.target.checked;
    setNotificationsEnabled(newValue);
    localStorage.setItem("notificationsEnabled", JSON.stringify(newValue));
  };

  // Uitlegitems voor "How It Works"
  const explanationItems = [
    {
      title: "Single Proven Strategy",
      description: "Our platform employs one thoroughly tested trading strategy optimized for performance and risk management.",
      icon: <FileCopyIcon sx={{ fontSize: 40, color: "#ccc" }} />
    },
    {
      title: "Direct Trade Execution",
      description: "Trades are executed directly via our decentralized smart contract on PancakeSwap Futures for full transparency.",
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: "#ccc" }} />
    },
    {
      title: "Profit Sharing Module",
      description: "Enjoy a profit sharing model where profits are split 75% to you and 25% to the platform.",
      icon: <MonetizationOnIcon sx={{ fontSize: 40, color: "#ccc" }} />
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ParticlesBackground />
      <Navbar onNotifOpen={handleNotifOpen} />
      <Container maxWidth="md" sx={{ mt: 8, textAlign: "center", px: { xs: 2, sm: 4 } }}>
        {/* Hero Section met extra glas-effect en glow */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            textTransform: "uppercase",
            fontSize: { xs: "3.5rem", md: "5rem" },
            background: "linear-gradient(90deg, rgba(0,255,198,0.9), rgba(0,255,198,1), rgba(0,255,198,0.9))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "4px",
            mb: 2,
            textShadow: "4px 4px 10px rgba(0,0,0,0.5)"
          }}
        >
          Smart Copy Trading
        </Typography>
        <Typography
          variant="h5"
          sx={{
            mt: 2,
            color: "#fff",
            fontWeight: 500,
            fontSize: { xs: "1.2rem", md: "1.5rem" },
            textShadow: "2px 2px 6px rgba(0,0,0,0.7)",
            letterSpacing: "1px"
          }}
        >
          Next-Gen Trading: Smart Contracts, Automated Execution, and Consistent Passive Income.
        </Typography>
      </Container>
      {/* Statistics Card */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(15px)",
            boxShadow: "0px 12px 30px rgba(0,0,0,0.7)",
            padding: 4,
            borderRadius: "16px"
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ color: "#fff", fontWeight: 700, textTransform: "uppercase" }}>
              Copiers
            </Typography>
            <Typography variant="h4" sx={{ color: "#00FFC6", mt: 1, fontWeight: 900 }}>
              12,345
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center", ml: "-1cm" }}>
            <Typography variant="subtitle2" sx={{ color: "#fff", fontWeight: 700, textTransform: "uppercase" }}>
              Total Invested
            </Typography>
            <Typography variant="h4" sx={{ color: "#00FFC6", mt: 1, fontWeight: 900 }}>
              $678,900
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ color: "#fff", fontWeight: 700, textTransform: "uppercase" }}>
              Realized PnL
            </Typography>
            <Typography variant="h4" sx={{ color: "#00FFC6", mt: 1, fontWeight: 900 }}>
              $67,900
            </Typography>
          </Box>
        </Box>
      </Container>
      {/* Top Strategy Managers */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: "20px", textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            color: "#fff",
            textTransform: "uppercase",
            fontSize: { xs: "1.8rem", md: "2.5rem" }
          }}
        >
          One Strategy, Infinite Potential: Smart Contract Powered Trading
        </Typography>
      </Container>
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <CardSlider />
      </Container>
      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ mb: 2, textAlign: "center" }}>
        <Typography variant="h3" sx={{ fontWeight: 900, color: "#fff", textTransform: "uppercase" }}>
          How It Works
        </Typography>
      </Container>
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4} justifyContent="center">
          {explanationItems.map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card
                sx={{
                  background: "rgba(30, 30, 30, 0.7)",
                  backdropFilter: "blur(15px)",
                  borderRadius: "16px",
                  boxShadow: "0px 12px 30px rgba(0,0,0,0.7)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 3,
                  textAlign: "center",
                  transition: "box-shadow 0.3s ease-in-out",
                  "&:hover": { boxShadow: "0 0 20px #00FFC6" },
                  position: "relative",
                  zIndex: 1,
                  border: "1px solid rgba(255, 255, 255, 0.2)"
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{item.icon}</Box>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, color: "#00FFC6" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: "#fff", lineHeight: 1.8 }}>
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* FAQ Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            color: "#fff",
            textTransform: "uppercase",
            textAlign: "center",
            mb: 4
          }}
        >
          FAQ
        </Typography>
        <Accordion sx={{ background: "rgba(30, 30, 30, 0.7)", backdropFilter: "blur(15px)", color: "#fff", mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#00FFC6" }} />}>
            <Typography variant="h6" sx={{ fontWeight: "900" }}>
              What is Smart Copy Trading?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ fontWeight: "700" }}>
              Smart Copy Trading allows you to automatically replicate a single proven strategy – removing the guesswork from trading.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ background: "rgba(30, 30, 30, 0.7)", backdropFilter: "blur(15px)", color: "#fff", mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#00FFC6" }} />}>
            <Typography variant="h6" sx={{ fontWeight: "900" }}>
              How does the Profit Sharing Module work?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ fontWeight: "700" }}>
              Our module splits profits 75% to you and 25% to the platform, ensuring you receive the majority of the returns.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ background: "rgba(30, 30, 30, 0.7)", backdropFilter: "blur(15px)", color: "#fff", mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#00FFC6" }} />}>
            <Typography variant="h6" sx={{ fontWeight: "900" }}>
              How does the single strategy work?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ fontWeight: "700" }}>
              We use one thoroughly tested trading strategy executed via our decentralized smart contract on PancakeSwap Futures, ensuring optimal performance and transparency.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ background: "rgba(30, 30, 30, 0.7)", backdropFilter: "blur(15px)", color: "#fff", mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#00FFC6" }} />}>
            <Typography variant="h6" sx={{ fontWeight: "900" }}>
              What are the risks involved?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ fontWeight: "700" }}>
              While our strategy is optimized for risk management, all investments carry risks. Please invest responsibly.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ background: "rgba(30, 30, 30, 0.7)", backdropFilter: "blur(15px)", color: "#fff", mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#00FFC6" }} />}>
            <Typography variant="h6" sx={{ fontWeight: "900" }}>
              Do I need any trading experience?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ fontWeight: "700" }}>
              No prior trading experience is required. Our automated system makes it simple for beginners to start trading.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ background: "rgba(30, 30, 30, 0.7)", backdropFilter: "blur(15px)", color: "#fff", mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#00FFC6" }} />}>
            <Typography variant="h6" sx={{ fontWeight: "900" }}>
              Can I withdraw my funds anytime?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ fontWeight: "700" }}>
              Yes, you have full control over your funds and can withdraw your profits at any time without hidden fees.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ background: "rgba(30, 30, 30, 0.7)", backdropFilter: "blur(15px)", color: "#fff", mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#00FFC6" }} />}>
            <Typography variant="h6" sx={{ fontWeight: "900" }}>
              How secure is the platform?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ fontWeight: "700" }}>
              Our platform uses decentralized smart contracts and records all transactions on-chain, ensuring full transparency and security.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ background: "rgba(30, 30, 30, 0.7)", backdropFilter: "blur(15px)", color: "#fff", mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#00FFC6" }} />}>
            <Typography variant="h6" sx={{ fontWeight: "900" }}>
              How is profit reinvestment handled?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ fontWeight: "700" }}>
              Profits are automatically reinvested to help compound your returns and grow your portfolio.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ background: "rgba(30, 30, 30, 0.7)", backdropFilter: "blur(15px)", color: "#fff", mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#00FFC6" }} />}>
            <Typography variant="h6" sx={{ fontWeight: "900" }}>
              What are the fees?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ fontWeight: "700" }}>
              Our platform uses a profit sharing model with a 75/25 split. You receive 75% of the profits, while 25% goes to support the platform. No additional fees are charged per profit claim.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ background: "rgba(30, 30, 30, 0.7)", backdropFilter: "blur(15px)", color: "#fff", mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#00FFC6" }} />}>
            <Typography variant="h6" sx={{ fontWeight: "900" }}>
              How do I get started?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ fontWeight: "700" }}>
              Simply register an account, deposit USDT, and follow our single proven strategy to start earning passive income.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Container>
      {/* Vernieuwde Footer */}
      <Box
        sx={{
          mt: "auto",
          py: 3,
          background: "linear-gradient(135deg, #1e1e1e, #121212)",
          borderTop: "1px solid #333",
          textAlign: "center",
          boxShadow: "0px -2px 15px rgba(0, 0, 0, 0.7)"
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: "0.9rem",
            color: "#ccc",
            letterSpacing: "0.5px"
          }}
        >
          © 2025 TradingVault. All rights reserved.
        </Typography>
      </Box>
      <Drawer
        anchor="right"
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(15px)",
            color: "#fff",
            p: 2
          }
        }}
      >
        <NotificationContent
          notifications={filteredNotifications}
          notificationsEnabled={notificationsEnabled}
          handleToggleNotifications={handleToggleNotifications}
          userWallet={userWallet}
        />
      </Drawer>
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #00FFC6;
          border-radius: 3px;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </ThemeProvider>
  );
}
