// Assets
import avatar1 from "assets/img/avatars/avatar1.png";
import avatar2 from "assets/img/avatars/avatar2.png";
import avatar3 from "assets/img/avatars/avatar3.png";
import avatar4 from "assets/img/avatars/avatar4.png";
import avatar5 from "assets/img/avatars/avatar5.png";
import avatar7 from "assets/img/avatars/avatar7.png";
import avatar8 from "assets/img/avatars/avatar8.png";
import avatar9 from "assets/img/avatars/avatar9.png";
import avatar10 from "assets/img/avatars/avatar10.png";
// Custom icons
import {AdobexdLogo, AtlassianLogo, InvisionLogo, JiraLogo, SlackLogo, SpotifyLogo,} from "components/Icons/Icons.js";
import {AiOutlineExclamation} from "react-icons/ai";
import {FaArrowDown, FaArrowUp, FaBell, FaCreditCard, FaFilePdf, FaHtml5, FaShoppingCart,} from "react-icons/fa";
import {SiDropbox} from "react-icons/si";

export const dashboardTableData = [
  {
    logo: AdobexdLogo,
    name: "Argon Dashboard Chakra Version",
    members: [avatar1, avatar2, avatar3, avatar4, avatar5],
    budget: "$14,000",
    progression: 60,
  },
  {
    logo: AtlassianLogo,
    name: "Add Progress Track",
    members: [avatar3, avatar2],
    budget: "$3,000",
    progression: 10,
  },
  {
    logo: SlackLogo,
    name: "Fix Platform Errors",
    members: [avatar10, avatar4],
    budget: "Not set",
    progression: 100,
  },
  {
    logo: SpotifyLogo,
    name: "Launch our Mobile App",
    members: [avatar2, avatar3, avatar7, avatar8],
    budget: "$32,000",
    progression: 100,
  },
  {
    logo: JiraLogo,
    name: "Add the New Pricing Page",
    members: [avatar10, avatar3, avatar7, avatar2, avatar8],
    budget: "$400",
    progression: 25,
  },
  {
    logo: InvisionLogo,
    name: "Redesign New Online Shop",
    members: [avatar9, avatar3, avatar2],
    budget: "$7,600",
    progression: 40,
  },
];

export const timelineData = [
  {
    logo: FaBell,
    title: "$2400, Design changes",
    date: "22 DEC 7:20 PM",
    color: "teal.300",
  },
  {
    logo: FaHtml5,
    title: "New order #4219423",
    date: "21 DEC 11:21 PM",
    color: "orange",
  },
  {
    logo: FaShoppingCart,
    title: "Server Payments for April",
    date: "21 DEC 9:28 PM",
    color: "blue.400",
  },
  {
    logo: FaCreditCard,
    title: "New card added for order #3210145",
    date: "20 DEC 3:52 PM",
    color: "orange.300",
  },
  {
    logo: SiDropbox,
    title: "Unlock packages for Development",
    date: "19 DEC 11:35 PM",
    color: "purple",
  },
  {
    logo: AdobexdLogo,
    title: "New order #9851258",
    date: "18 DEC 4:41 PM",
  },
];

export const tablesTableData = [
  {
    logo: avatar1,
    name: "Esthera Jackson",
    email: "alexa@simmmple.com",
    subdomain: "Manager",
    domain: "Organization",
    status: "Online",
    date: "14/06/21",
  },
  {
    logo: avatar2,
    name: "Alexa Liras",
    email: "laurent@simmmple.com",
    subdomain: "Programmer",
    domain: "Developer",
    status: "Offline",
    date: "12/05/21",
  },
  {
    logo: avatar3,
    name: "Laurent Michael",
    email: "laurent@simmmple.com",
    subdomain: "Executive",
    domain: "Projects",
    status: "Online",
    date: "07/06/21",
  },
  {
    logo: avatar4,
    name: "Freduardo Hill",
    email: "freduardo@simmmple.com",
    subdomain: "Manager",
    domain: "Organization",
    status: "Online",
    date: "14/11/21",
  },
  {
    logo: avatar5,
    name: "Daniel Thomas",
    email: "daniel@simmmple.com",
    subdomain: "Programmer",
    domain: "Developer",
    status: "Offline",
    date: "21/01/21",
  },
  {
    logo: avatar7,
    name: "Mark Wilson",
    email: "mark@simmmple.com",
    subdomain: "Designer",
    domain: "UI/UX Design",
    status: "Offline",
    date: "04/09/20",
  },
];

export const tablesProjectData = [
  {
    logo: AdobexdLogo,
    name: "Chakra UI Version",
    budget: "$14,000",
    status: "Working",
    progression: 60,
  },
  {
    logo: AtlassianLogo,
    name: "Add Progress Track",
    budget: "$3,000",
    status: "Canceled",
    progression: 10,
  },
  {
    logo: SlackLogo,
    name: "Fix Platform Errors",
    budget: "Not set",
    status: "Done",
    progression: 100,
  },
  {
    logo: SpotifyLogo,
    name: "Launch our Mobile App",
    budget: "$32,000",
    status: "Done",
    progression: 100,
  },
  {
    logo: JiraLogo,
    name: "Add the New Pricing Page",
    budget: "$400",
    status: "Working",
    progression: 25,
  },
];

export const invoicesData = [
  {
    date: "March, 01, 2020",
    code: "#MS-415646",
    price: "$180",
    logo: FaFilePdf,
    format: "PDF",
  },
  {
    date: "February, 10, 2020",
    code: "#RV-126749",
    price: "$250",
    logo: FaFilePdf,
    format: "PDF",
  },
  {
    date: "April, 05, 2020",
    code: "#FB-212562",
    price: "$560",
    logo: FaFilePdf,
    format: "PDF",
  },
  {
    date: "June, 25, 2019",
    code: "#QW-103578",
    price: "$120",
    logo: FaFilePdf,
    format: "PDF",
  },
  {
    date: "March, 01, 2019",
    code: "#AR-803481",
    price: "$300",
    logo: FaFilePdf,
    format: "PDF",
  },
];

export const billingData = [
  {
    name: "Oliver Liam",
    company: "Viking Burrito",
    email: "oliver@burrito.com",
    number: "FRB1235476",
  },
  {
    name: "Lucas Harper",
    company: "Stone Tech Zone",
    email: "lucas@stone-tech.com",
    number: "FRB1235476",
  },
  {
    name: "Ethan James",
    company: "Fiber Notion",
    email: "ethan@fiber.com",
    number: "FRB1235476",
  },
];

export const newestTransactions = [
  {
    name: "Netflix",
    date: "27 March 2022, at 12:30 PM",
    price: "- $2,500",
    logo: FaArrowDown,
  },
  {
    name: "Apple",
    date: "27 March 2022, at 12:30 PM",
    price: "+ $2,500",
    logo: FaArrowUp,
  },
];

export const olderTransactions = [
  {
    name: "Stripe",
    date: "26 March 2022, at 13:45 PM",
    price: "+ $800",
    logo: FaArrowUp,
  },
  {
    name: "HubSpot",
    date: "26 March 2022, at 12:30 PM",
    price: "+ $1,700",
    logo: FaArrowUp,
  },
  {
    name: "Webflow",
    date: "26 March 2022, at 05:00 PM",
    price: "Pending",
    logo: AiOutlineExclamation,
  },
  {
    name: "Microsoft",
    date: "25 March 2022, at 16:30 PM",
    price: "- $987",
    logo: FaArrowDown,
  },
];

export const pageVisits = [
  {
    pageName: "/argon/",
    visitors: "4,569",
    uniqueUsers: 340,
    bounceRate: "46,53%"
  },
  {
    pageName: "/argon/index.html",
    visitors: "3,985",
    uniqueUsers: 319,
    bounceRate: "46,53%"
  },
  {
    pageName: "/argon/charts.html",
    visitors: "3,513",
    uniqueUsers: 294,
    bounceRate: "36,49%"
  },
  {
    pageName: "/argon/tables.html",
    visitors: "2,050",
    uniqueUsers: 147,
    bounceRate: "50,87%"
  },
  {
    pageName: "/argon/profile.html",
    visitors: "1,795",
    uniqueUsers: 190,
    bounceRate: "46,53%"
  },
]

export const socialTraffic = [
  {
    referral: "Facebook",
    visitors: "1,480",
    percentage: 60,
    color: "orange",
  },
  {
    referral: "Facebook",
    visitors: "5,480",
    percentage: 70,
    color: "orange",
  },
  {
    referral: "Google",
    visitors: "4,807",
    percentage: 80,
    color: "cyan",
  },
  {
    referral: "Instagram",
    visitors: "3,678",
    percentage: 75,
    color: "cyan",
  },
  {
    referral: "Twitter",
    visitors: "2,645",
    percentage: 30,
    color: "orange",
  }
]

export const eventTraffic = [
  {
    eventName: "Formation PSC1 S13",
    eventParticipants: "12",
    percentage: 80,
    color: "green",
  },
  {
    eventName: "Distribution vestimentaire S13",
    eventParticipants: "29",
    percentage: 95,
    color: "green",
  },
  {
    eventName: "Distribution alimentaire S13",
    eventParticipants: "27",
    percentage: 90,
    color: "green",
  },
  {
    eventName: "EPISOL S13",
    eventParticipants: "21",
    percentage: 75,
    color: "green",
  },
  {
    eventName: "Formation PSC1 S12",
    eventParticipants: "7",
    percentage: 65,
    color: "green",
  }
]

export const eventList = [
  {
    eventName: "EPISOL S14",
    eventDate: "08/04/2023",
    eventManager: "MOLERO Quentin",
    eventParticipants: "22"
  },
  {
      eventName: "Distribution alimentaire S14",
    eventDate: "08/04/2023",
    eventManager: "MOLERO Quentin",
    eventParticipants: "29"
  },
  {
    eventName: "Distribution vestimentaire S14",
    eventDate: "08/04/2023",
    eventManager: "MOLERO Quentin",
    eventParticipants: "22"
  },
  {
    eventName: "Formation PSC1 S14",
    eventDate: "11/04/2023",
    eventManager: "MOLERO Quentin",
    eventParticipants: "12"
  },
  {
    eventName: "EPISOL S15",
    eventDate: "15/04/2023",
    eventManager: "MOLERO Quentin",
    eventParticipants: "14"
  },
]

export const stockFoodCategories = [
  {
    name: "Legumes",
    quantity: "760",
    percentage: 25,
    color: "green",
  },
  {
    name: "Pates",
    quantity: "590",
    percentage: 18,
    color: "green",
  },
  {
    name: "Riz",
    quantity: "560",
    percentage: 17,
    color: "green",
  },
  {
    name: "Huiles",
    quantity: "260",
    percentage: 9,
    color: "orange",
  },
  {
    name: "Dentifrice",
    quantity: "80",
    percentage: 3,
    color: "red",
  }
]

export const stockClothCategories = [
  {
    name: "T-shirts",
    quantity: "2145",
    percentage: 31,
    color: "green",
  },
  {
    name: "Pantalons",
    quantity: "980",
    percentage: 16,
    color: "green",
  },
  {
    name: "Manteaux",
    quantity: "705",
    percentage: 14,
    color: "orange",
  },
  {
    name: "Chaussures",
    quantity: "180",
    percentage: 3,
    color: "red",
  },
  {
    name: "Chapeaux",
    quantity: "20",
    percentage: 1,
    color: "red",
  }
]
