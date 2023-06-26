import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Profile from "../components/Profile";
import Spinner from "../components/Spinner";
// import Title from "../components/Title";
import { getProfiles, reset } from "../features/profiles/profileSlice";

import { useAppDispatch, useAppSelector } from '../app/hooks';



const ProfilesPage = () => {




	// const { profiles, isLoading, isError, message } = useSelector(
	// 	(state) => state.profiles
	// );

	const { profiles, isError, isLoading, isSuccess, message } = useAppSelector((state) => state.profiles);

	const dispatch = useAppDispatch();


	useEffect(
		() => {
			dispatch(getProfiles());
		},
		[dispatch]
	);

	// useEffect(() => {
	// 	if (isError) {
	// 		toast.error(message, { icon: "😭" });
	// 	}
	// 	dispatch(getProfiles());
	// }, [dispatch, isError, message]);

	if (isLoading) {
		return <Spinner />;
	}
	return (
		<>

			{/* <Title title="Our Profiles Catalog" /> */}
			<h1>profile page</h1>
			<Container>
				<Row>
					<Col className="mg-top text-center">

						<hr className="hr-text" />
					</Col>
				</Row>
				{
					<>
						<Row className="mt-3">
							
				<h3>{ JSON.stringify(profiles)}</h3>
						</Row>
					</>
				}
			</Container>
		</>
	);
};

export default ProfilesPage;