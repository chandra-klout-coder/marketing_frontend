import Page404 from "../errors/Page404";
import Faqs from "../layouts/admin/Faqs";
import Blank from "../layouts/admin/Blank";
import Event from "../layouts/admin/Event";
import Reports from "../layouts/admin/Reports";
import GetHelp from "../layouts/admin/GetHelp";
import Profile from "../layouts/admin/Profile";
import AllEvent from "../layouts/admin/AllEvent";
import Settings from "../layouts/admin/Settings";
import AddSkills from "../layouts/admin/AddSkills";
import ViewEvent from "../layouts/admin/ViewEvent";
import EditEvent from "../layouts/admin/EditEvent";
import Dashboard from "../layouts/admin/Dashboard";
import AllReports from "../layouts/admin/AllReports";
import ViewSponsor from "../layouts/admin/ViewSponsor";
import AddSponsors from "../layouts/admin/AddSponsors";
import AddAttendee from "../layouts/admin/AddAttendee";
import AllContacts from "../layouts/admin/AllContacts";
import AllSponsors from "../layouts/admin/AllSponsors";
import AllAttendee from "../layouts/admin/AllAttendee";
import ActivityLog from "../layouts/admin/ActivityLog";
import ViewAttendee from "../layouts/admin/ViewAttendee";
import EditAttendee from "../layouts/admin/EditAttendee";
import EmailManager from "../layouts/admin/EmailManager";
import AllFeedbacks from "../layouts/admin/AllFeedbacks";
import EmailMailing from "../layouts/admin/EmailMailing";
import EditSponsors from "../layouts/admin/EditSponsors";
import Page404Dashboard from "../errors/Page404Dashboard";
import ContactStatus from "../layouts/admin/ContactStatus";
import SponsorStatus from "../layouts/admin/SponsorStatus";
import ChangePassword from "../layouts/admin/ChangePassword";
import AllAttendeeList from "../layouts/admin/AllAttendeeList";
import SendSmsAttendee from "../layouts/admin/SendSmsAttendee";
import SendMailAttendee from "../layouts/admin/SendMailAttendee";
import PrivacyPolicy from "../components/PrivacyPolicy";
import TermsAndConditions from "../components/TermsAndConditions";
import AllIcp from "../layouts/admin/AllIcp";
import AddMember from "../layouts/admin/AddMember";
import AllMember from "../layouts/admin/AllMember";
import EditMember from "../layouts/admin/EditMember";
import ViewMember from "../layouts/admin/ViewMember";
import UploadData from "../layouts/admin/UploadData";
import UploadMemberData from "../layouts/admin/UploadMemberData";
import UploadMembers from "../layouts/admin/UploadMembers";
import Connects from "../layouts/admin/Connects";
import ViewChatPointDetails from "../layouts/admin/ViewChatPointDetails";
import ViewContactPointDetails from "../layouts/admin/ViewContactPointDetails";
import ViewChatDetails from "../layouts/admin/ViewChatDetails";
import AllocatedPoints from "../layouts/admin/AllocatedPoints";
import ForgotPassword from "../components/ForgotPassword";
import BuyCredit from "../layouts/admin/BuyCredit";

const routes = [
  { path: "/admin", exact: true, name: "Admin", component: Dashboard },
  {
    path: "/admin/dashboard",
    exact: true,
    name: "Dashboard",
    component: Dashboard,
  },
  { path: "/admin/profile", exact: true, name: "Profile", component: Profile },
  {
    path: "/admin/change-password",
    exact: true,
    name: "ChangePassword",
    component: ChangePassword,
  },
  {
    path: "/admin/all-member",
    exact: true,
    name: "AllMember",
    component: AllMember,
  },
  {
    path: "/admin/add-member",
    exact: true,
    name: "AddMember",
    component: AddMember,
  },
  {
    path: "/admin/upload-members",
    exact: true,
    name: "UploadMembers",
    component: UploadMembers,
  },
  {
    path: "/admin/edit-member/:id",
    exact: true,
    name: "EditMember",
    component: EditMember,
  },

  {
    path: "/admin/view-member/:id",
    exact: true,
    name: "ViewMember",
    component: ViewMember,
  },
  {
    path: "/forgot-password",
    exact: true,
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/admin/connects",
    exact: true,
    name: "Connects",
    component: Connects,
  },
  {
    path: "/admin/view-contact-point-details/:id",
    exact: true,
    name: "ViewContactPointDetails",
    component: ViewContactPointDetails,
  },
  {
    path: "/admin/view-chat-point-details/:id",
    exact: true,
    name: "ViewChatPointDetails",
    component: ViewChatPointDetails,
  },
  {
    path: "/admin/view-chat-details/:userId/:contactUserId",
    exact: true,
    name: "ViewChatDetails",
    component: ViewChatDetails,
  },

  {
    path: "/admin/allocate-points/:id",
    exact: true,
    name: "AllocatePoints",
    component: AllocatedPoints,
  },

  {
    path: "/admin/buy-credits",
    exact: true,
    name: "BuyCredit",
    component: BuyCredit,
  },

  {
    path: "/admin/all-icp",
    exact: true,
    name: "AllIcp",
    component: AllIcp,
  },
  {
    path: "/admin/upload-account-list",
    exact: true,
    name: "UploadData",
    component: UploadData,
  },
  {
    path: "/admin/upload-member-data",
    exact: true,
    name: "UploadMemberData",
    component: UploadMemberData,
  },
  {
    path: "/admin/send-notification-attendee/:id",
    exact: true,
    name: "SendSmsAttendee",
    component: SendSmsAttendee,
  },
  {
    path: "/admin/send-mail-attendee/:id",
    exact: true,
    name: "SendMailAttendee",
    component: SendMailAttendee,
  },
  {
    path: "/admin/all-attendee-list",
    exact: true,
    name: "AllAttendeeList",
    component: AllAttendeeList,
  },
  {
    path: "/admin/all-attendee/:id",
    exact: true,
    name: "AllAttendee",
    component: AllAttendee,
  },
  {
    path: "/admin/add-attendee/:id",
    exact: true,
    name: "AddAttendee",
    component: AddAttendee,
  },
  {
    path: "/admin/edit-attendee/:id",
    exact: true,
    name: "EditAttendee",
    component: EditAttendee,
  },
  {
    path: "/admin/view-attendee-details/:id",
    exact: true,
    name: "ViewAttendee",
    component: ViewAttendee,
  },

  {
    path: "/admin/add-skills",
    exact: true,
    name: "AddSkills",
    component: AddSkills,
  },

  {
    path: "/admin/sponsors",
    exact: true,
    name: "AllSponsors",
    component: AllSponsors,
  },
  {
    path: "/admin/add-sponsors/:id",
    exact: true,
    name: "AddSponsors",
    component: AddSponsors,
  },
  {
    path: "/admin/add-sponsor",
    exact: true,
    name: "AddSponsors",
    component: AddSponsors,
  },
  {
    path: "/admin/edit-sponsor/:id",
    exact: true,
    name: "EditSponsors",
    component: EditSponsors,
  },
  {
    path: "/admin/view-sponsor-details/:id",
    exact: true,
    name: "ViewSponsor",
    component: ViewSponsor,
  },
  {
    path: "/admin/sponsor-status",
    exact: true,
    name: "SponsorStatus",
    component: SponsorStatus,
  },
  {
    path: "/admin/email-manager",
    exact: true,
    name: "EmailManager",
    component: EmailManager,
  },
  {
    path: "/admin/mass-mailing",
    exact: true,
    name: "EmailMailing",
    component: EmailMailing,
  },
  {
    path: "/admin/all-contacts",
    exact: true,
    name: "AllContacts",
    component: AllContacts,
  },
  {
    path: "/admin/contact-status",
    exact: true,
    name: "ContactStatus",
    component: ContactStatus,
  },
  { path: "/admin/get-help", exact: true, name: "GetHelp", component: GetHelp },
  {
    path: "/admin/all-feedbacks",
    exact: true,
    name: "AllFeedbacks",
    component: AllFeedbacks,
  },

  { path: "/admin/faqs", exact: true, name: "Faqs", component: Faqs },
  {
    path: "/admin/settings",
    exact: true,
    name: "Settings",
    component: Settings,
  },
  {
    path: "/admin/all-reports",
    exact: true,
    name: "AllReports",
    component: AllReports,
  },
  {
    path: "/admin/reports",
    exact: true,
    name: "Reports",
    component: Reports,
  },
  {
    path: "/admin/activity-log",
    exact: true,
    name: "ActivityLog",
    component: ActivityLog,
  },
  {
    path: "/admin/blank",
    exact: true,
    name: "Blank",
    component: Blank,
  },
  {
    path: "/privacy-policy",
    exact: true,
    name: "PrivacyPolicy",
    component: PrivacyPolicy,
  },
  {
    path: "/terms-and-condition",
    exact: true,
    name: "TermsAndConditions",
    component: TermsAndConditions,
  },
  {
    path: "/admin/blank",
    exact: true,
    name: "Blank",
    component: Blank,
  },
  {
    path: "/admin/404",
    exact: true,
    name: "Page404",
    component: Page404Dashboard,
  },
];

export default routes;
