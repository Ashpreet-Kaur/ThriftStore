-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 23, 2026 at 07:53 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `retrend_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clothes`
--

CREATE TABLE `clothes` (
  `cloth_id` int(11) NOT NULL,
  `itemName` varchar(100) NOT NULL,
  `section` varchar(20) NOT NULL,
  `category` varchar(50) NOT NULL,
  `size` varchar(10) NOT NULL,
  `ccondition` varchar(50) NOT NULL,
  `price` int(6) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `new_price` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clothes`
--

INSERT INTO `clothes` (`cloth_id`, `itemName`, `section`, `category`, `size`, `ccondition`, `price`, `description`, `image`, `email`, `created_at`, `status`, `new_price`) VALUES
(1, 'Classic Oxford Shirt', 'Men', 'Topwear', 'M', 'Like New', 1599, 'Crisp cotton Oxford shirt for smart-casual outfits.', 'image-1747647154366.jpeg', 'seed@retrend.com', '2026-04-23 10:40:48', 'approved', 1299),
(2, 'Relaxed Linen Shirt', 'Men', 'Topwear', 'L', 'Excellent', 1499, 'Breathable linen blend shirt for summer days.', 'image-1747647379924.jpeg', 'seed@retrend.com', '2026-04-23 10:40:48', 'approved', NULL),
(3, 'Slim Fit Chinos', 'Men', 'Bottomwear', '32', 'Gently Used', 1399, 'Tailored chinos with stretch comfort and clean silhouette.', 'image-1747648979279.jpg', 'seed@retrend.com', '2026-04-23 10:40:48', 'approved', 1099),
(4, 'Casual Denim Jeans', 'Men', 'Bottomwear', '34', 'Excellent', 1699, 'Mid-wash denim jeans with relaxed taper fit.', 'image-1747736314819.webp', 'seed@retrend.com', '2026-04-23 10:40:48', 'approved', NULL),
(5, 'Navy Loafers', 'Men', 'Casual Shoes', '9', 'Like New', 2199, 'Soft suede loafers for everyday smart looks.', 'image-1747736465307.jpg', 'seed@retrend.com', '2026-04-23 10:40:48', 'approved', 1799),
(6, 'Minimal Sneakers', 'Men', 'Sports Shoes', '8', 'Excellent', 2499, 'Clean white sneakers with cushioned sole.', 'image-1747736696369.jpg', 'seed@retrend.com', '2026-04-23 10:40:48', 'approved', NULL),
(7, 'Formal Pinstripe Blazer', 'Men', 'Formal Wear', 'L', 'Like New', 2999, 'Structured pinstripe blazer for office and occasions.', 'image-1747736777165.jpg', 'seed@retrend.com', '2026-04-23 10:40:48', 'approved', 2499),
(8, 'Embroidered Kurta', 'Men', 'Ethnic Wear', 'XL', 'Excellent', 1899, 'Festive kurta with subtle thread embroidery.', 'image-1747736947704.avif', 'seed@retrend.com', '2026-04-23 10:40:48', 'approved', NULL),
(9, 'Polarized Sunglasses', 'Men', 'Sunglasses', 'Free', 'Like New', 1199, 'UV-protected polarized sunglasses in matte frame.', 'image-1747737064855.jpg', 'seed@retrend.com', '2026-04-23 10:40:48', 'approved', 899),
(10, 'Chronograph Watch', 'Men', 'Watches', 'Free', 'Gently Used', 2599, 'Metal strap chronograph watch with blue dial.', 'image-1747737138635.webp', 'seed@retrend.com', '2026-04-23 10:40:48', 'approved', NULL),
(11, 'Silk Blend Blouse', 'Women', 'Tops', 'S', 'Like New', 1699, 'Elegant blouse with soft drape and puff sleeves.', 'image-1747737243335.avif', 'seed@retrend.com', '2026-04-23 10:40:48', 'approved', 1399),
(12, 'High Waist Trousers', 'Women', 'Bottoms', 'M', 'Excellent', 1599, 'Pleated high-waist trousers with wide-leg fit.', 'image-1747739133113.webp', 'seed@retrend.com', '2026-04-23 10:40:48', 'approved', NULL),
(13, 'Floral Midi Dress', 'Women', 'Dresses', 'M', 'Like New', 2299, 'Flowy floral midi dress with flattering neckline.', 'image-1747739274458.webp', 'seed@retrend.com', '2026-04-23 10:40:48', 'approved', 1899),
(14, 'Summer Jumpsuit', 'Women', 'Jumpsuits', 'L', 'Excellent', 2099, 'One-piece jumpsuit with belt and side pockets.', 'image-1747739360922.webp', 'seed@retrend.com', '2026-04-23 10:40:48', 'approved', NULL),
(15, 'Pastel Saree', 'Women', 'Sarees', 'Free', 'Like New', 2799, 'Pastel georgette saree with lightweight fall.', 'image-1747739444379.webp', 'seed@retrend.com', '2026-04-23 10:40:48', 'approved', 2399),
(16, 'Daily Kurti', 'Women', 'Kurtis', 'M', 'Excellent', 1199, 'Straight-cut daily wear kurti in breathable rayon.', 'image-1747739500266.webp', 'seed@retrend.com', '2026-04-23 10:40:48', 'approved', NULL),
(17, 'Designer Handbag', 'Women', 'Handbags', 'Free', 'Like New', 2199, 'Structured handbag with magnetic flap closure.', 'image-1747739544828.jpg', 'seed@retrend.com', '2026-04-23 10:40:48', 'approved', 1799),
(18, 'Ethnic Kurta Set', 'Women', 'Kurta Sets', 'L', 'Excellent', 2499, 'Coordinated kurta and pant set for festive events.', 'image-1747739628894.avif', 'seed@retrend.com', '2026-04-23 10:40:48', 'approved', NULL),
(19, 'Statement Sandals', 'Women', 'Sandals', '6', 'Like New', 1399, 'Comfort sandals with metallic buckle accents.', 'image-1747739668085.jpg', 'seed@retrend.com', '2026-04-23 10:40:48', 'approved', 1099),
(20, 'Layered Necklace Set', 'Women', 'Jewelery', 'Free', 'Excellent', 1299, 'Layered jewelry set with anti-tarnish finish.', 'image-1747739714298.avif', 'seed@retrend.com', '2026-04-23 10:40:49', 'approved', NULL),
(21, 'Graphic Tee Pack', 'Kids', 'Boys Clothing', '10Y', 'Like New', 999, 'Pack of two soft cotton graphic tees for boys.', 'image-1747739742376.jpg', 'seed@retrend.com', '2026-04-23 10:40:49', 'approved', 799),
(22, 'Denim Dungaree Set', 'Kids', 'Girls Clothing', '8Y', 'Excellent', 1199, 'Dungaree and tee set with stretch comfort fabric.', 'image-1747739776062.webp', 'seed@retrend.com', '2026-04-23 10:40:49', 'approved', NULL),
(23, 'Kids Runner Shoes', 'Kids', 'Footwear', '3', 'Like New', 1499, 'Lightweight running shoes with padded heel support.', 'image-1747739925792.jpg', 'seed@retrend.com', '2026-04-23 10:40:49', 'approved', 1199),
(24, 'Mini Backpack', 'Kids', 'Accessories', 'Free', 'Excellent', 899, 'Compact backpack for school and weekend use.', 'image-1747739982760.webp', 'seed@retrend.com', '2026-04-23 10:40:49', 'approved', NULL),
(25, 'Boys Polo Combo', 'Kids', 'Boys Clothing', '12Y', 'Excellent', 1099, 'Two-tone polo combo with soft pique cotton.', 'image-1747740032086.webp', 'seed@retrend.com', '2026-04-23 10:40:49', 'approved', 899),
(26, 'Girls Party Dress', 'Kids', 'Girls Clothing', '9Y', 'Like New', 1399, 'Party dress with layered tulle and satin ribbon.', 'image-1747740271362.webp', 'seed@retrend.com', '2026-04-23 10:40:49', 'approved', NULL),
(27, 'Textured Hoodie', 'Men', 'Topwear', 'XL', 'Excellent', 1899, 'Textured fleece hoodie for winter layering.', 'image-1747976416910.avif', 'seed@retrend.com', '2026-04-23 10:40:49', 'approved', NULL),
(28, 'Weekend Shorts', 'Men', 'Bottomwear', 'M', 'Like New', 1099, 'Relaxed fit cotton shorts for everyday comfort.', 'image-1747979093196.avif', 'seed@retrend.com', '2026-04-23 10:40:49', 'approved', 899),
(29, 'Vintage Windcheater', 'Men', 'Accessories', 'L', 'Gently Used', 2099, 'Retro color-block windcheater in lightweight shell.', 'image-1748323911087.webp', 'seed@retrend.com', '2026-04-23 10:40:49', 'approved', NULL),
(30, 'Classic Crop Top', 'Women', 'Tops', 'S', 'Excellent', 999, 'Ribbed crop top with square neckline.', 'image-1748323963797.webp', 'seed@retrend.com', '2026-04-23 10:40:49', 'approved', 799),
(31, 'Wide Leg Denims', 'Women', 'Bottoms', 'M', 'Like New', 1799, 'High-rise wide-leg denims with faded wash.', 'image-1748324089335.jpg', 'seed@retrend.com', '2026-04-23 10:40:49', 'approved', NULL),
(32, 'Printed Kurta', 'Women', 'Ethnic Wear', 'L', 'Excellent', 1499, 'Printed ethnic kurta with contrast piping.', 'image-1748324747823.jpg', 'seed@retrend.com', '2026-04-23 10:40:49', 'approved', 1199),
(33, 'Kids Slip-on Sandals', 'Kids', 'Footwear', '2', 'Like New', 899, 'Easy slip-on sandals with anti-skid sole.', 'image-1750356211979.avif', 'seed@retrend.com', '2026-04-23 10:40:49', 'approved', NULL),
(34, 'Adventure Tee', 'Kids', 'Boys Clothing', '11Y', 'Excellent', 849, 'Adventure print t-shirt for active kids.', 'image-1750612824562.jpg', 'seed@retrend.com', '2026-04-23 10:40:49', 'approved', 699),
(35, 'Glitter Hair Set', 'Kids', 'Accessories', 'Free', 'Like New', 499, 'Colorful hair accessory set for girls.', 'image-1751003960905.webp', 'seed@retrend.com', '2026-04-23 10:40:49', 'approved', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `product_type` varchar(255) DEFAULT NULL,
  `quantity_order` int(11) DEFAULT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `buyer_name` varchar(255) DEFAULT NULL,
  `buyer_email` varchar(255) DEFAULT NULL,
  `buyer_address` text DEFAULT NULL,
  `payer_id` varchar(255) DEFAULT NULL,
  `merchant_id` varchar(255) DEFAULT NULL,
  `payment_trans_no` varchar(255) DEFAULT NULL,
  `payed_amount` decimal(10,2) DEFAULT NULL,
  `payment_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `seller_requests`
--

CREATE TABLE `seller_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `seller_requests`
--

INSERT INTO `seller_requests` (`id`, `user_id`, `status`, `created_at`) VALUES
(1, 3, 'approved', '2025-05-22 06:22:09'),
(3, 5, 'approved', '2025-05-22 10:38:59'),
(5, 11, 'approved', '2025-05-22 16:57:57'),
(7, 13, 'approved', '2025-05-23 05:58:53'),
(8, 14, 'approved', '2025-05-27 04:36:29'),
(9, 15, 'approved', '2025-05-27 04:51:12'),
(10, 17, 'approved', '2025-05-28 04:19:24'),
(11, 18, 'rejected', '2025-05-28 06:11:55'),
(12, 19, 'approved', '2025-05-28 06:32:18'),
(13, 21, 'approved', '2025-06-02 11:42:41'),
(14, 22, 'approved', '2025-06-03 12:02:58'),
(15, 24, 'rejected', '2025-06-19 17:39:26'),
(16, 26, 'approved', '2025-06-22 17:15:31'),
(17, 20, 'approved', '2025-06-27 06:03:13'),
(18, 28, 'approved', '2025-09-16 08:50:15'),
(19, 30, 'approved', '2026-02-13 09:23:55'),
(20, 31, 'approved', '2026-04-22 12:10:09');

-- --------------------------------------------------------

--
-- Table structure for table `user_image`
--

CREATE TABLE `user_image` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `status` int(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `user_role` enum('user','admin','superadmin') DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_image`
--

INSERT INTO `user_image` (`id`, `name`, `email`, `gender`, `mobile`, `address`, `photo`, `password`, `status`, `created_at`, `user_role`) VALUES
(3, 'Manroop', 'manroop123@gmail.com', 'female', '9900887766', '', 'null', 'manroop123', 1, '2025-05-29 09:39:38', ''),
(5, 'Jaspreet', 'jaspreet24@gmail.com', 'Female', '9417674840', '', 'photo-1747732298035.jpg', 'jaspreet24', 1, '2025-07-12 05:22:15', ''),
(11, 'Lovepreet', 'lovepreet45@gmail.com', 'Male', '9417674841', '', NULL, 'lovepreet45', 1, '2025-05-27 12:25:46', 'admin'),
(13, 'Jaskaran', 'jaskaran89@gmail.com', 'Male', '9900887766', '', 'photo-1748334125636.jpg', 'jaskaran89', 1, '2025-06-07 09:27:31', ''),
(14, 'Karanveer', 'karan78@gmail.com', 'male', '9008877665', '', NULL, 'karan78', 1, '2025-05-28 04:12:37', 'admin'),
(15, 'Manpreet', 'manpreet123@gmail.com', 'female', '9087654321', '', NULL, 'manpreet123', 1, '2025-05-27 04:51:33', 'admin'),
(17, 'Ashpreet Kahlon', 'ashpreetkahlon70@gmail.com', 'Female', '9417674841', '123', 'photo-1748405933833.jpg', '1234', 1, '2025-06-19 18:17:18', ''),
(18, 'Simran', 'simran24@gmail.com', 'female', '998877665544', '', NULL, 'simran24', 1, '2025-05-28 05:08:07', 'user'),
(19, 'Sakshi', 'sakshi53@gmail.com', 'female', '9988776655', '', NULL, 'sakshi53', 1, '2025-05-28 06:33:12', ''),
(20, 'Anshu', 'anshu45@gmail.com', 'female', '908765432', '', NULL, 'anshu45', 1, '2025-06-27 06:03:46', ''),
(21, 'Gurpreet Singh', 'gurpreet78@gmail.com', 'male', '9876543210', '', NULL, 'gurpreet78', 1, '2025-06-02 11:43:35', ''),
(22, 'Jishnu', 'jishnu12@gmail.com', 'male', '9988776655', '', NULL, 'jishnu12', 1, '2025-06-03 12:04:38', ''),
(23, 'Gurpreet', 'gurpreet123@gmail.com', 'male', '9900887766', '', NULL, 'gurpreet123', 1, '2025-06-07 07:47:12', 'user'),
(24, 'Manroop', 'manroop22@gmail.com', 'female', '9417674841', '', NULL, 'manroop22', 1, '2025-06-19 17:34:04', 'user'),
(25, 'Ashpreet', 'admin123@gmail.com', '', '', '', NULL, 'admin123', NULL, NULL, 'superadmin'),
(26, 'Vansh', 'vansh54@gmail.com', 'male', '', '', NULL, 'vansh54', 1, '2025-06-27 06:03:37', 'admin'),
(27, 'Prabhleen', 'prabhleen123@gmail.com', 'female', '', '', NULL, 'prabhleen123', 1, '2025-06-27 06:14:59', 'user'),
(28, 'Priyanka', 'priyanka@gmail.com', 'female', '', '', NULL, '12345', 1, '2025-09-16 08:52:11', ''),
(29, 'Navroop', 'navroop@gmail.com', 'male', '', '', NULL, 'ash123', 1, '2026-02-04 05:12:11', 'user'),
(30, 'Megha ', 'megha@gmail.com', '', '9900887766', '', NULL, 'megha123', 1, '2026-02-13 09:26:55', ''),
(31, 'anita', 'anita30@gmail.com', 'female', '908765432', '', NULL, 'anita30', 1, '2026-04-22 12:11:14', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `clothes`
--
ALTER TABLE `clothes`
  ADD PRIMARY KEY (`cloth_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payment_trans_no` (`payment_trans_no`);

--
-- Indexes for table `seller_requests`
--
ALTER TABLE `seller_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_image`
--
ALTER TABLE `user_image`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `clothes`
--
ALTER TABLE `clothes`
  MODIFY `cloth_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `seller_requests`
--
ALTER TABLE `seller_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `user_image`
--
ALTER TABLE `user_image`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_image` (`id`),
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `clothes` (`cloth_id`);

--
-- Constraints for table `seller_requests`
--
ALTER TABLE `seller_requests`
  ADD CONSTRAINT `seller_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_image` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
