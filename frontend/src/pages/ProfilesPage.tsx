import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Profile from "../components/Profile";
import Spinner from "../components/Spinner";
import Title from "../components/Title";
import { getProfiles, reset } from "../features/profiles/profileSlice";

import { useAppDispatch, useAppSelector } from '../app/hooks';
import ProfilePublic from '../type_interfaces/ProfilePublic';



const ProfilesPage = () => {




	// const { profiles, isLoading, isError, message } = useSelector(
	// 	(state) => state.profiles
	// );

	const { profiles, isError, isLoading, isSuccess, message } = useAppSelector((state) => state.profiles);

	const dispatch = useAppDispatch();


	useEffect(
		() => {
		if (isError) {
			toast.error(message, { icon: "😭" });
		}

			dispatch(getProfiles());
		},
		[dispatch,isError,message]
	);

	if (isLoading) {
		return <Spinner />;
	}
	return (
		<>

			<Title title="LanguaVersity user profiles" />
			<h1>profile page</h1>
			<Container>
				<Row>
					<Col className="mg-top text-center">
						<h1>Our Catalog of properties</h1>
						<hr className="hr-text" />
					</Col>
				</Row>
				{
					<>
						<Row className="mt-3">
							{profiles.map((profile:ProfilePublic) => (
								<Col
									key={profile.id}
									sm={12}
									md={6}
									lg={4}
									xl={3}
								>
									<Profile profile={profile} />
								</Col>
							))}
						</Row>
					</>
				}
			</Container>
		</>
	);
};

export default ProfilesPage;