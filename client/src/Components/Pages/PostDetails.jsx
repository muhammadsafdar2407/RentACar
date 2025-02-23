import React, { useRef, useState, useEffect, useContext } from "react";
import Footer from "../../Main-Components/Footer";
import axiosInstance from "../../Instance/instance";
import { GoLocation } from "react-icons/go";
import { IoIosColorPalette } from "react-icons/io";
import { SiBrandfolder } from "react-icons/si";
import { TbBike } from "react-icons/tb";
import { MdOutlineMergeType } from "react-icons/md";
import { io } from "socket.io-client";
import("./list.css");
import Comment from "./Comment";
import { DateRange } from "react-date-range";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiShare } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import {
  AiOutlineHeart,
  AiOutlineLeft,
  AiOutlineRight,
  AiFillCar,
} from "react-icons/ai";
import DetailLoading from "./LoadingDetails";
import { ToastContainer } from "react-toastify";
import { toastError, toastSuccess } from "../Toast/Toast";
import { AuthContext } from "../../Context/AuthContext";

const PostDetails = ({ socket }) => {
  const [post, setPost] = useState({});
  const id = window.location.pathname.split("/")[2];
  console.log(id);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [datePicker, setDatePicker] = useState(false);
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [booked, setBooked] = useState(false);
  const [isStateUpdated, setIsStateUpdated] = useState(false);
  // const owner_id = post?.customer_id;
  const { user } = useContext(AuthContext);

  const pagelocation = window.location.pathname.split("/");

  const navigate = useNavigate();
  const prevState = useLocation().state;
  const [pending, setPending] = useState(false);

  const fetchPost = async () => {
    try {
      const response = await axiosInstance.get(`/post/getpost/${id}`);
      setTimeout(() => {
        setLoading(false);
      }, 300);
      setPost(response.data);
    } catch (err) {
      if (err.response.status === 404) {
        console.log(err);
        setTimeout(() => {
          return navigate("/404");
        }, 300);
      }
      console.log(err);
    }
  };

  const [data, setData] = useState({
    vehicle_post_id: id,
    checkIn: prevState?.checkIn || "",
    checkOut: prevState?.checkOut || "",
    total_price: 100,
  });

  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  };

  const numberOfDays = () => {
    const start = new Date(data.checkIn);
    const end = new Date(data.checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      console.log("Return Num Days:  ", diffDays);
      return 1;
    }

    console.log("Num Days:  ", diffDays);

    return diffDays;
  };

  const priceChange = () => {
    setData((prevData) => ({
      ...prevData,
      total_price: numberOfDays() * post.price_per_day,
    }));
  };

  const handleSelect = (ranges) => {
    selectionRange.startDate = ranges.selection.startDate;
    selectionRange.endDate = ranges.selection.endDate;
  };

  const handleDatePicker = () => {
    setDatePicker(!datePicker);
    handleDate();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNotification = async () => {
    try {
      socket.current.emit("notify", {
        message: "Hello World",
        receiver_id: post?.customer_id,
        sender_name: user?.customername,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getComments = async () => {
    try {
      const response = await axiosInstance.get(`/comment/getComments/${id}`);
      setComments(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDate = () => {
    setData((prevData) => ({
      ...prevData,
      checkIn: convertDate(selectionRange.startDate),
      checkOut: convertDate(selectionRange.endDate),
    }));
  };

  const handleSubmit = async (event) => {
    //event.preventDefault();
    if (newComment.trim() === "") return;
    resetInputFields();
    try {
      const data = {
        vehicle_post_id: id,
        comment: newComment,
        rating: rating,
      };
      socket.current.emit("notify", {
        notification_message: `Commented on your post`,
        receiver_id: post?.customer_id,
        sender_name: user?.customername,
      });
      const response = await axiosInstance.post("/comment/createComment", data);
    } catch (err) {
      if (err.response.status === 401) {
        toastError("Please login to comment");
      }
      console.log(err);
    }
  };

  const resetInputFields = () => {
    setNewComment("");
    setRated(false);
    setRating(0);
  };

  const handleRatingClick = (e) => {
    const value = e.target.getAttribute("value");

    if (rated) {
      setRating(value);
      setRated(false);
    } else {
      setRating(value);
      setRated(true);
    }
  };

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let j = i;
    if (i <= rating) {
      stars.push(
        <span
          key={i}
          className="star rated"
          value={i}
          onClick={handleRatingClick}
        >
          &#9733;
        </span>
      );
    } else {
      stars.push(
        <span key={i} className="star" value={i} onClick={handleRatingClick}>
          &#9734;
        </span>
      );
    }
  }

  const updateTotalPriceIfSell = async () => {
    if (post.vehicle_listing_type === "Sell") {
      console.log("Before update:", data.total_price);
      console.log("Per day price:", post.price_per_day);
  
      // Await a Promise that resolves after the next render
      await new Promise((resolve) =>
        setData((prevData) => {
          const updatedData = {
            ...prevData,
            total_price: post.price_per_day,
          };
          resolve(updatedData); // Resolves the Promise
          return updatedData;
        })
      );
  
      console.log("State update queued for total_price.");
    }
  };

  useEffect(() => {
    if (isStateUpdated) {
      console.log("Updated total_price:", data.total_price);
  
      // Perform additional actions after state update
      setIsStateUpdated(false); // Reset the flag
    }
  }, [data.total_price, isStateUpdated]);


  
  const handleBooking = async () => {
    try {
      if (post.vehicle_listing_type === "Sell") {
        console.log("Before update:", data.total_price);
        console.log("Per day price:", post.price_per_day);
  
        setData((prevData) => ({
          ...prevData,
          total_price: post.price_per_day,
        }));
  
        // Wait until the state update is reflected
        setIsStateUpdated(true);
        
      }

      socket.current.emit("notify", {
        notification_message: `Booking Request for ${post?.vehicle_name} from ${data.checkIn} to ${data.checkOut}`,
        receiver_id: post?.customer_id,
        sender_name: user?.customername,
      });

      const response = await axiosInstance.post("/booking/createBooking", data);
      const response2 = await axiosInstance.post(
        "/notification/createNotification",
        {
          receiver_id: post?.customer_id,
          sender_id: user?.customer_id,
          sender_name: user?.customername,
          notification_message: `Booking Request for ${post?.vehicle_name} from ${data.checkIn} to ${data.checkOut}`,
        }
      );
      console.log(response);
      if (response.status === 201) {
        setPending(true);
        toastSuccess("Booking Successful");
      } else {
        toastError("Booking Failed");
        setBooked(false);
      }
    } catch (err) {
      if (err.response.status === 401) {
        toastError("Please Login First");
      }
    }
  };

  const convertDate = (date) => {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = `0${newDate.getMonth() + 1}`.slice(-2);
    const day = newDate.getDate();
    return `${year}-${month}-${day}`;
  };

  const isBooked = async () => {
    try {
      const response = await axiosInstance.get(`/booking/bookedByUser`, {
        params: {
          vehicle_number: id,
        },
      });
      console.log(response);
      if (response.status === 202) {
        setPending(true);
        return;
      }

      if (response.status === 200) {
        setBooked(false);
      }
    } catch (err) {
      if (err.response.status === 400) {
        setPending(false);
        setBooked(true);
      }
      console.log(err);
    }
  };

  const shouldFetch = useRef(true);
  useEffect(() => {
    if (shouldFetch.current) {
      window.scrollTo(0, 0);

      isBooked();
      getComments();
      // createSocketConnection();
      fetchPost();
      shouldFetch.current = false;
    }
  }, []);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("connect", () => {
        console.log("connected");
      });

      socket.current.on("newComment", (comment) => {
        setComments((prevState) => [...prevState, comment]);
      });

      socket.current.on("notify", (data) => {
        isBooked();
      });
    }
  }, []);

  useEffect(() => {
    if (data.checkIn && data.checkOut) {
      priceChange();
    }
  }, [data.checkIn, data.checkOut, post.price_per_day]);

  return (
    <div className="dark:bg-dark-secondary">
      <div className="h-full w-full">
        {/* <h1 className="text-center text-4xl font-bold text-black mt-10">
        {" "}
        Post Details{" "}
      </h1> */}
        {loading ? (
          <div className="flex justify-center mt-5">
            <DetailLoading />
          </div>
        ) : (
          <div className="xl:max-w-[1200px] max-w-[90%] gap-6 w-screen mx-auto pt-10 mb-20 flex flex-col justify-center ">
            <div>
              <div className="flex-col flex gap-6 xl:flex-row justify-between items-center">
                <div>
                  <button className="border-[2px]  font-semibold  border-gray-300 rounded-full py-[10px] px-4 text-black hover:border-black text-sm hover:bg-black hover:text-white transition-all duration-300 ease-in-out">
                    <Link
                      to="/"
                      className="flex justify-center items-center gap-2"
                    >
                      <AiOutlineLeft />
                      <span>Go Home</span>
                    </Link>
                  </button>
                </div>
                <div>
                  <ol
                    className="flex items-center whitespace-nowrap min-w-0"
                    aria-label="Breadcrumb"
                  >
                    <li className="text-sm">
                      <Link
                        className="flex items-center text-gray-500 hover:text-blue-600"
                        to={"/"}
                      >
                        Home
                        <AiOutlineRight className="flex-shrink-0 mx-3 h-2.5 w-2.5 text-gray-600 dark:text-gray-600" />
                      </Link>
                    </li>
                    <li className="text-sm">
                      <Link
                        className="flex items-center text-gray-500 hover:text-blue-600"
                        to={"/explore"}
                      >
                        {pagelocation[1]}
                        <AiOutlineRight className="flex-shrink-0 mx-3 h-2.5 w-2.5 text-gray-600 dark:text-gray-600" />
                      </Link>
                    </li>
                    <li
                      className="text-sm font-semibold text-indigo-500 truncate dark:text-gray-200"
                      aria-current="page"
                    >
                      Post no. {id}
                    </li>
                  </ol>
                </div>
              </div>
            </div>
            <div>
              <div className="w-full flex items-center justify-between ">
                <h1 className="md:text-[48px] text-[32px] text-left font-semibold text-black dark:text-accent-3">
                  {" "}
                  {post.vehicle_name}{" "}
                </h1>

                <div className="flex justify-center items-center gap-4">
                  <div className="border-[2px] border-gray-300 rounded-full p-2 text-gray-500 hover:border-black text-2xl hover:bg-black hover:text-white transition-all duration-300 ease-in-out">
                    <FiShare />
                  </div>
                  <div className="border-[2px] border-gray-300 rounded-full p-2 text-gray-500 hover:border-black text-2xl hover:bg-black hover:text-white transition-all duration-300 ease-in-out">
                    <AiOutlineHeart />
                  </div>
                  <div className="border-[2px] border-gray-300 rounded-full p-2 text-gray-500 hover:border-black text-2xl hover:bg-black hover:text-white transition-all duration-300 ease-in-out">
                    <RxCross2 />
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <p className="ml-2 text-sm font-bold text-gray-900 dark:text-white">
                    {parseFloat(post.avg_rating).toFixed(1)}
                  </p>
                  <span className="w-1 h-1 mx-1.5 bg-gray-400 rounded-full dark:bg-gray-400"></span>
                  <a
                    href="#"
                    className="text-sm font-medium text-gray-500 underline hover:no-underline dark:text-white"
                  >
                    {comments.length} Reviews
                  </a>
                </div>
              </div>

              <h1 className="flex gap-2 items-start mt-3 py-2 font-medium text-gray-400">
                <GoLocation className="text-2xl text-gray-400" />
                Location : {post.address}
              </h1>
            </div>
            <div className=" flex-col flex lg:flex-row justify-center items-center w-full gap-5 ">
              <div className="w-full shadow-md rounded-3xl">
                <img
                  className="w-full max-h-[45vh] h-full object-cover rounded-3xl"
                  src={post.vehicle_image}
                  alt="post"
                />
              </div>
            </div>

            <div className="lg:flex-row flex flex-col gap-5">
              <div className="flex flex-col gap-5">
                <div>
                  <h1 className="text-[32px] mt-6 text-left font-semibold text-black dark:text-accent-3">
                    Vehicle details
                  </h1>
                  <h1 className="text-left text-black flex items-center gap-5">
                    <span className="text-accent-1 font-bold text-xl">
                      Car owner:
                    </span>
                    <span className="text-white text-xl font-medium flex gap-3 items-center">
                      <div className="relative inline-flex items-center justify-center w-250 h-10 px-4 py-2 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          {post.customername ? post.customername : "A"}
                        </span>
                      </div>
                    </span>
                  </h1>
                </div>

                <div className="flex flex-col ">
                  <div className="grid content-center grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="px-2 py-5 border border-gray-300  gap-2 flex justify-center items-center rounded-xl dark:text-accent-3 dark:glass">
                      <IoIosColorPalette className="text-2xl" />
                      <h1>Color: {post.vehicle_color}</h1>
                    </div>
                    <div className=" px-2 py-5 border border-gray-300 gap-2 flex justify-center items-center rounded-xl dark:text-accent-3 dark:glass">
                      <SiBrandfolder className="text-2xl" />
                      <h1>Brand: {post.vehicle_brand}</h1>
                    </div>
                    <div className=" px-2 py-5 border border-gray-300 gap-2 flex justify-center items-center rounded-xl dark:text-accent-3 dark:glass">
                      {post.vehicle_type === "Car" ? (
                        <AiFillCar className="text-2xl" />
                      ) : (
                        <TbBike className="text-2xl" />
                      )}
                      <h1>Model: {post.vehicle_year}</h1>
                    </div>
                    <div className=" px-2 py-5 border border-gray-300 gap-2 flex justify-center items-center rounded-xl dark:text-accent-3 dark:glass">
                      <MdOutlineMergeType className="text-2xl" />
                      <h1>Listing Type: {post.vehicle_listing_type}</h1>
                    </div>
                  </div>
                  <div className="mt-5 dark:text-accent-3">
                    <h1 className="text-[32px] mt-6 text-left font-semibold text-black dark:text-accent-3">
                      Description
                    </h1>
                    <h1 className="mt-2">{post.vehicle_description}</h1>

                    <h1 className="text-[32px] mt-6 text-left font-semibold text-black dark:text-accent-3">
                      Features
                    </h1>
                    <h1 className="mt-2">{post.vehicle_features}</h1>

                    <button
                      onClick={handleNotification}
                      className="bg-blue-600 text-white px-5 py-2 rounded-xl mt-5"
                    >
                      Start Chat
                    </button>
                  </div>
                </div>
              </div>

              <div className="">
                <div className="h-full">
                  <div className="xl:flex-1 pb-5 lg:w-[450px] mx-auto dark:bg-gray-900 dark:border-0 border px-10 py-6 lg:px-8 lg:py-10 rounded-3xl ">
                    <div>
                      <h1 className="text-3xl font-semibold text-black mb-3 dark:text-accent-3">
                        Rs. {post.price_per_day}
                      </h1>
                    </div>

                    {post.vehicle_listing_type === "Rent" ? (
                      <div className="flex flex-col mb-[5px] border-b dark:border-b-gray-700">
                        <div>
                          <label className="text-gray-500 font-bold dark:text-accent-1">
                            Start Date
                          </label>
                          <input
                            onClick={handleDatePicker}
                            disabled={pending || booked}
                            type="text"
                            readOnly={true}
                            value={data.checkIn}
                            onChange={handleChange}
                            placeholder="Pick a date"
                            className="w-full border-2 text-gray-500 border-gray-300 bg-white rounded-lg p-4 mb-4 cursor-pointer text-xl dark:bg-gray-800 dark:border-gray-800"
                            name="checkIn"
                          />
                          {datePicker && (
                            <div className="flex justify-center items-center">
                              <DateRange
                                className=""
                                ranges={[selectionRange]}
                                rangeColors={["#000000"]}
                                onChange={handleSelect}
                                minDate={new Date()}
                                footerContent={
                                  <div className="flex justify-center items-center">
                                    <button
                                      onClick={handleDatePicker}
                                      className="bg-black text-white px-4 py-2 rounded-lg"
                                    >
                                      Close
                                    </button>
                                  </div>
                                }
                              />
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="text-gray-500 font-bold dark:text-accent-1">
                            End Date
                          </label>
                          <input
                            onClick={handleDatePicker}
                            type="text"
                            disabled={pending || booked}
                            readOnly={true}
                            value={data.checkOut}
                            onChange={handleChange}
                            placeholder="Pick a date"
                            className="w-full border-2 text-gray-500 border-gray-300 bg-white rounded-lg p-4 mb-4 cursor-pointer text-xl dark:bg-gray-800 dark:border-gray-800"
                            id="checkOut"
                            name="checkOut"
                          />
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}

                    <div>
                      {post.vehicle_listing_type === "Rent" ? (
                        <div className="border-b dark:border-b-gray-700">
                          <h1 className="text-[24px] mt-5 font-semibold text-black mb-3 dark:text-accent-1">
                            Duration Details
                          </h1>
                          <h1 className="text-[18px] mt-5 font-semibold text-gray-500 mb-3 dark:text-accent-3">
                            Number of days: {data.checkIn ? numberOfDays() : 0}
                          </h1>
                        </div>
                      ) : (
                        <></>
                      )}

                      <div>
                        <h1 className="text-[24px] mt-5 font-semibold text-black mb-3 dark:text-accent-1">
                          Pricing Details
                        </h1>
                        <h1 className="text-[18px] flex justify-between items-center mt-5 font-semibold text-gray-500 mb-3 dark:text-accent-3">
                          <div>
                            {post.vehicle_listing_type === "Rent"
                              ? "Price Per Day:"
                              : "Price:"}{" "}
                          </div>{" "}
                          <span className="text-black dark:text-gray-500">
                            Rs. {post.price_per_day}
                          </span>{" "}
                        </h1>
                        <h1 className="text-[18px] flex justify-between items-center mt-5 font-semibold text-gray-500 mb-3 dark:text-accent-3">
                          <span> Total Price:</span>{" "}
                          <span className="text-black dark:text-gray-500">
                            Rs.{" "}
                            {data.checkIn
                              ? numberOfDays() * post.price_per_day
                              : post.price_per_day}
                          </span>{" "}
                        </h1>
                      </div>
                    </div>

                    <div>
                      {booked ? (
                        <h1 className="text-[18px] flex justify-between items-center mt-5 font-semibold text-gray-500 mb-3 dark:text-accent-3">
                          <span>Booking Status:</span>{" "}
                          <span className="text-black dark:text-gray-500">
                            Booked
                          </span>{" "}
                        </h1>
                      ) : (
                        { pending } && (
                          <h1 className="text-[18px] flex justify-between items-center mt-5 font-semibold text-gray-500 mb-3 dark:text-accent-3">
                            <span>Booking Status:</span>{" "}
                            <span className="text-black dark:text-gray-500">
                              Pending
                            </span>{" "}
                          </h1>
                        )
                      )}
                    </div>

                    <Link>
                      {pending ? (
                        <button
                          className="bg-yellow-500  w-full text-white p-3 rounded-md"
                          disabled={true}
                        >
                          Pending
                        </button>
                      ) : booked ? (
                        <button
                          disabled={true}
                          className=" bg-green-500 w-full text-white p-3 rounded-md"
                        >
                          Booked
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            console.log("Rent Button");
                            handleBooking();
                          }}
                          className="button-transition bg-indigo-500 hover:bg-black w-full text-white p-3 rounded-md"
                          disabled={false}
                        >
                          {post.vehicle_listing_type === "Rent"
                            ? "Rent"
                            : "Buy"}
                        </button>
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* 
      {booked ? (
        <button
          disabled={true}
          className=" bg-green-500 w-full text-white p-3 rounded-md"
        >
          Booked
        </button>
      ) : (
        <button
          onClick={handleBooking}
          className="button-transition bg-indigo-500 hover:bg-black w-full text-white p-3 rounded-md"
        >
          {post.vehicle_listing_type === "Rent" ? "Rent" : "Buy"}
        </button>
      )} */}

        {loading ? (
          <></>
        ) : (
          <div>
            <div className="max-w-[90%] xl:max-w-[1200px] mx-auto ">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl lg:text-[24px] font-semibold text-gray-900 dark:text-white">
                  Add a review
                </h2>
                <div className="flex justify-center text-3xl cursor-pointer">
                  {stars}
                </div>
              </div>
              <form className="mb-6" onSubmit={handleSubmit}>
                <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-300 dark:glass dark:border-0">
                  <label htmlFor="comment" className="sr-only">
                    Your comment
                  </label>
                  <input
                    id="comment"
                    rows="6"
                    className="px-0 py-4 text-xl w-full text-gray-900 border-0 dark:glass dark:text-gray-300 focus:outline-none"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                    required
                  ></input>
                </div>
                <button
                  type="submit"
                  className="inline-flex bg-accent-1 text-bold items-center py-2.5 px-4 text-md font-medium text-center text-white rounded-lg "
                >
                  Post comment
                </button>
              </form>
              <div className="flex flex-col">
                {comments.map((comment, index) => (
                  <Comment
                    className="text-black dark:text-gray-500"
                    key={index}
                    comment={comment.comment_text}
                    author={comment.customer_name}
                    date={convertDate(comment.created_at)}
                    stars={comment.rating}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default PostDetails;
