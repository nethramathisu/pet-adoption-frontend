import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

import PetDetails from "./pages/PetDetails";
import MyApplications from "./pages/Applications";
import Favorites from "./pages/Favorites";
import Inbox from "./pages/Inbox";
import ChatPage from "./pages/chatPage";

import ShelterDashboard from "./pages/shelter/ShelterDashboard";
import ShelterPets from "./pages/shelter/ShelterPets";
import ShelterApplications from "./pages/shelter/ShelterApplications";
import CreatePet from "./pages/shelter/CreatePet";
import EditPet from "./pages/shelter/EditPet";

import RequestMeeting from "./pages/RequestMeeting";
import ShelterMeetings from "./pages/shelter/ShelterMeetings";
import MyMeetings from "./pages/MyMeetings";

import ShelterReviews from "./pages/shelter/ShelterReviews";
import PetReviews from "./pages/PetReviews";

import MyFosterPets from "./pages/foster/MyFosterPets";
import AddFosterUpdate from "./pages/foster/AddFosterUpdate";
import FosterUpdates from "./pages/shelter/FosterUpdates";

import Profile from "./pages/Profile";
import AuthRedirect from "./AuthRedirect";

function App()
{
	return (
		<BrowserRouter>
			<AuthRedirect />
			<Routes>

				{/* ================= PUBLIC ROUTES ================= */}

				<Route path="/" element={<MainLayout />}>
					<Route index element={<Home />} />
					<Route path="pet/:id" element={<PetDetails />} />
				</Route>

				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />

				{/* ================= PROTECTED USER ROUTES ================= */}

				<Route
					path="/app"
					element={
						<ProtectedRoute>
							<MainLayout />
						</ProtectedRoute>
					}
				>
					<Route path="favorites" element={<Favorites />} />
					<Route path="my-applications" element={<MyApplications />} />
					<Route path="inbox" element={<Inbox />} />
					<Route path="chat/:userId/:petId" element={<ChatPage />} />
					<Route path="my-meetings" element={<MyMeetings />} />
					<Route path="/app/meeting/:petId" element={<RequestMeeting />} />
					<Route path="profile" element={<Profile />} />
					<Route path="reviews/pet/:id" element={<PetReviews />} />
					<Route path="reviews/shelter/:id" element={<ShelterReviews />} />
				</Route>

				{/* ================= SHELTER ================= */}

				<Route
					path="/shelter"
					element={
						<RoleRoute allowedRoles={["Shelter"]}>
							<MainLayout />
						</RoleRoute>
					}
				>
					<Route index element={<ShelterDashboard />} />
					<Route path="pets" element={<ShelterPets />} />
					<Route path="applications" element={<ShelterApplications />} />
					<Route path="create-pet" element={<CreatePet />} />
					<Route path="edit/:id" element={<EditPet />} />
					<Route path="meetings" element={<ShelterMeetings />} />
					<Route path="updates/:petId" element={<FosterUpdates />} />
				</Route>

				{/* ================= FOSTER ================= */}

				<Route
					path="/foster"
					element={
						<RoleRoute allowedRoles={["Foster"]}>
							<MainLayout />
						</RoleRoute>
					}
				>
					<Route index element={<MyFosterPets />} />
					<Route path="update/:petId" element={<AddFosterUpdate />} />
				</Route>

			</Routes>
		</BrowserRouter>
	);
}

export default App;