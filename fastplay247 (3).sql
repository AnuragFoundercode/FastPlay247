-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 06, 2025 at 08:03 PM
-- Server version: 10.11.10-MariaDB-log
-- PHP Version: 8.3.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fastplay247`
--

-- --------------------------------------------------------

--
-- Table structure for table `bets`
--

CREATE TABLE `bets` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `game_type` varchar(50) NOT NULL,
  `match_id` bigint(20) NOT NULL,
  `bet_choice` varchar(20) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','won','lost') DEFAULT 'pending',
  `bet_value` double(5,2) NOT NULL,
  `result` varchar(20) DEFAULT NULL,
  `win_amount` decimal(10,2) DEFAULT 0.00,
  `type` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bets`
--

INSERT INTO `bets` (`id`, `user_id`, `game_type`, `match_id`, `bet_choice`, `amount`, `status`, `bet_value`, `result`, `win_amount`, `type`, `created_at`, `updated_at`) VALUES
(1, 7, 'teen20', 102251205151258, '1', 100.00, 'won', 1.98, 'Player A', 198.00, 'L', '2025-12-05 09:43:05', '2025-12-05 09:44:02');

-- --------------------------------------------------------

--
-- Table structure for table `rules`
--

CREATE TABLE `rules` (
  `id` int(11) NOT NULL,
  `description` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `rules`
--

INSERT INTO `rules` (`id`, `description`) VALUES
(1, '<p>Hello guys</p>');

-- --------------------------------------------------------

--
-- Table structure for table `settlement_adjustments`
--

CREATE TABLE `settlement_adjustments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settlement_ledger`
--

CREATE TABLE `settlement_ledger` (
  `id` int(11) NOT NULL,
  `bet_id` int(11) NOT NULL,
  `child_user` int(11) NOT NULL,
  `parent_user` int(11) NOT NULL,
  `child_PL` decimal(10,2) NOT NULL,
  `share_percent` decimal(10,2) NOT NULL,
  `share_amount` decimal(10,2) NOT NULL,
  `commission_percent` decimal(10,2) NOT NULL,
  `commission_amount` decimal(10,2) NOT NULL,
  `parent_final` decimal(10,2) NOT NULL,
  `datetime` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `settlement_ledger`
--

INSERT INTO `settlement_ledger` (`id`, `bet_id`, `child_user`, `parent_user`, `child_PL`, `share_percent`, `share_amount`, `commission_percent`, `commission_amount`, `parent_final`, `datetime`) VALUES
(1, 2, 7, 7, 100.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2025-12-06 11:14:43'),
(2, 2, 7, 6, 100.00, 50.00, 50.00, 0.00, 0.00, -50.00, '2025-12-06 11:14:43'),
(3, 2, 7, 5, 100.00, 60.00, 60.00, 0.00, 0.00, -60.00, '2025-12-06 11:14:43'),
(4, 2, 7, 4, 100.00, 70.00, 70.00, 0.00, 0.00, -70.00, '2025-12-06 11:14:43'),
(5, 2, 7, 3, 100.00, 80.00, 80.00, 0.00, 0.00, -80.00, '2025-12-06 11:14:43'),
(6, 2, 7, 2, 100.00, 90.00, 90.00, 0.00, 0.00, -90.00, '2025-12-06 11:14:43');

-- --------------------------------------------------------

--
-- Table structure for table `sport_bets`
--

CREATE TABLE `sport_bets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` bigint(20) NOT NULL,
  `event_name` varchar(255) DEFAULT NULL,
  `market_id` bigint(20) DEFAULT NULL,
  `market_name` varchar(255) DEFAULT NULL,
  `market_type` varchar(100) DEFAULT NULL,
  `bet_amount` decimal(10,2) DEFAULT 0.00,
  `actual_bet_amount` double(11,2) NOT NULL,
  `win_amount` double NOT NULL DEFAULT 0,
  `bet_status` enum('pending','won','lost') DEFAULT 'pending',
  `bet_message` varchar(255) DEFAULT NULL,
  `status` varchar(32) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `bet_value` double(10,2) DEFAULT NULL,
  `bet_choice` varchar(255) DEFAULT NULL,
  `gmId` varchar(255) DEFAULT NULL,
  `bet_size` double(11,2) DEFAULT NULL,
  `will_win` double(11,2) NOT NULL DEFAULT 0.00,
  `will_loss` double(11,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `sport_bets`
--

INSERT INTO `sport_bets` (`id`, `user_id`, `event_id`, `event_name`, `market_id`, `market_name`, `market_type`, `bet_amount`, `actual_bet_amount`, `win_amount`, `bet_status`, `bet_message`, `status`, `created_at`, `bet_value`, `bet_choice`, `gmId`, `bet_size`, `will_win`, `will_loss`) VALUES
(1, 7, 4, 'India v South Africa', 6246241765959, 'India', 'match1', 100.00, 100.00, 0, 'pending', 'bets saved successfully', 'pending', '2025-12-06 08:32:33', 29.00, 'L', '599572956', NULL, 29.00, 100.00),
(2, 7, 4, 'India v South Africa', 2422576503, '8 over run SA', 'fancy', 100.00, 100.00, 100, 'won', '25', 'pending', '2025-12-06 08:38:26', 100.00, 'K', '599572956', 28.00, 100.00, 100.00);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_bet_setting`
--

CREATE TABLE `tbl_bet_setting` (
  `id` int(11) NOT NULL,
  `casino_min_max` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`casino_min_max`)),
  `fancy_min_max` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`fancy_min_max`)),
  `bookmaker_min_max` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`bookmaker_min_max`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `tbl_bet_setting`
--

INSERT INTO `tbl_bet_setting` (`id`, `casino_min_max`, `fancy_min_max`, `bookmaker_min_max`) VALUES
(1, '{\"min\":100,\"max\":1000}', '{\"min\":100,\"max\":50000}', '{\"min\":100,\"max\":100000}');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_rollBack`
--

CREATE TABLE `tbl_rollBack` (
  `id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `gmId` varchar(255) NOT NULL,
  `market_name` varchar(255) NOT NULL,
  `remark` text DEFAULT NULL,
  `datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `tbl_rollBack`
--

INSERT INTO `tbl_rollBack` (`id`, `type`, `event_name`, `gmId`, `market_name`, `remark`, `datetime`) VALUES
(1, 'fancy', 'Australia v England', '611629359', 'test', '12 over run AUS', '2025-12-05 07:31:16');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_setting`
--

CREATE TABLE `tbl_setting` (
  `id` int(11) NOT NULL,
  `welcomMsg` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `tbl_setting`
--

INSERT INTO `tbl_setting` (`id`, `welcomMsg`) VALUES
(1, 'JAY MAI KI');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_transaction`
--

CREATE TABLE `tbl_user_transaction` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `amount` double(11,2) NOT NULL,
  `description` text NOT NULL,
  `type` enum('CR','DR') NOT NULL,
  `op_balance` double(11,2) DEFAULT NULL,
  `cl_balance` double(11,2) DEFAULT NULL,
  `status` enum('Pending','success','Failed') NOT NULL,
  `reason` int(11) NOT NULL DEFAULT 0 COMMENT '0=bet,1=account update',
  `datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `tbl_user_transaction`
--

INSERT INTO `tbl_user_transaction` (`id`, `userId`, `amount`, `description`, `type`, `op_balance`, `cl_balance`, `status`, `reason`, `datetime`) VALUES
(1, 7, 100.00, 'Bet placed on Melbourne Stars W v Sydney Sixers W (6 over run MS W)', 'DR', 861.75, 761.75, 'success', 0, '2025-12-03 06:08:26'),
(2, 7, 100.00, 'Bet placed on India v South Africa (1st 4 wkt runs IND(IND vs SA)adv)', 'DR', 761.75, 651.75, 'success', 0, '2025-12-03 08:41:39'),
(3, 7, 100.00, 'Bet placed on India v South Africa (50 over runs IND 2)', 'DR', 651.75, 551.75, 'success', 0, '2025-12-03 08:42:08'),
(4, 7, 500.00, 'Bet placed on Sydney Thunder W v Brisbane Heat W (Sydney Thunder W)', 'DR', 551.75, 51.75, 'success', 0, '2025-12-03 08:42:17'),
(5, 6, 100000.00, 'Amount Deposited (from master)', 'CR', 0.00, 100000.00, 'success', 1, '2025-12-03 08:49:15'),
(6, 5, 100000.00, 'Amount Deducted for user deposit', 'DR', 950000.00, 850000.00, 'success', 1, '2025-12-03 08:49:15'),
(7, 7, 100000.00, 'Amount Deposited (from master)', 'CR', 51.75, 100051.75, 'success', 1, '2025-12-03 08:49:33'),
(8, 6, 100000.00, 'Amount Deducted for user deposit', 'DR', 100000.00, 0.00, 'success', 1, '2025-12-03 08:49:33'),
(9, 7, 100.00, 'Bet placed on Sydney Thunder W v Brisbane Heat W (Sydney Thunder W)', 'DR', 100051.75, 99965.75, 'success', 0, '2025-12-03 08:55:43'),
(10, 7, 100.00, 'Bet placed on Sydney Thunder W v Brisbane Heat W (Brisbane Heat W)', 'DR', 99965.75, 99846.75, 'success', 0, '2025-12-03 08:55:50'),
(11, 7, 100.00, 'Bet placed on Sydney Thunder W v Brisbane Heat W (Brisbane Heat W)', 'DR', 99846.75, 99746.75, 'success', 0, '2025-12-03 08:55:58'),
(12, 7, 500.00, 'Bet placed on India v South Africa (India)', 'DR', 99746.75, 99246.75, 'success', 0, '2025-12-03 09:03:13'),
(13, 64, 100.00, 'Bet placed on India v South Africa (India)', 'DR', 7100.00, 7000.00, 'success', 0, '2025-12-03 09:03:50'),
(14, 64, 100.00, 'Bet placed on India v South Africa (India)', 'DR', 7000.00, 6900.00, 'success', 0, '2025-12-03 09:04:26'),
(15, 64, 1000.00, 'Bet placed on India v South Africa (20 over runs IND(IND vs SA)adv)', 'DR', 6900.00, 5900.00, 'success', 0, '2025-12-03 09:04:44'),
(16, 69, 100000000.00, 'Initial amount assigned by master', 'CR', 0.00, 100000000.00, 'success', 1, '2025-12-03 09:15:09'),
(17, 70, 100000000.00, 'Initial amount assigned by master', 'CR', 0.00, 100000000.00, 'success', 1, '2025-12-03 09:15:37'),
(18, 71, 100000000.00, 'Initial amount assigned by master', 'CR', 0.00, 100000000.00, 'success', 1, '2025-12-03 09:15:38'),
(19, 72, 10000000.00, 'Initial amount assigned by master', 'CR', 0.00, 10000000.00, 'success', 1, '2025-12-03 09:41:17'),
(20, 73, 90000000.00, 'Initial amount assigned by master', 'CR', 0.00, 90000000.00, 'success', 1, '2025-12-03 09:43:35'),
(21, 69, 90000000.00, 'Amount assigned to new admin', 'DR', 100000000.00, 10000000.00, 'success', 1, '2025-12-03 09:43:35'),
(22, 74, 80000000.00, 'Initial amount assigned by master', 'CR', 0.00, 80000000.00, 'success', 1, '2025-12-03 09:44:20'),
(23, 73, 80000000.00, 'Amount assigned to new admin', 'DR', 90000000.00, 10000000.00, 'success', 1, '2025-12-03 09:44:20'),
(24, 75, 70000000.00, 'Initial amount assigned by master', 'CR', 0.00, 70000000.00, 'success', 1, '2025-12-03 09:45:29'),
(25, 74, 70000000.00, 'Amount assigned to new admin', 'DR', 80000000.00, 10000000.00, 'success', 1, '2025-12-03 09:45:29'),
(26, 76, 50000000.00, 'Initial amount assigned by master', 'CR', 0.00, 50000000.00, 'success', 1, '2025-12-03 09:47:50'),
(27, 75, 50000000.00, 'Amount assigned to new admin', 'DR', 60000000.00, 10000000.00, 'success', 1, '2025-12-03 09:47:50'),
(28, 77, 10000000.00, 'Initial amount assigned by master', 'CR', 0.00, 10000000.00, 'success', 1, '2025-12-03 09:48:21'),
(29, 76, 10000000.00, 'Amount assigned to new admin', 'DR', 50000000.00, 40000000.00, 'success', 1, '2025-12-03 09:48:21'),
(30, 77, 1000.00, 'Bet placed on India v South Africa (India)', 'DR', 10000000.00, 9999000.00, 'success', 0, '2025-12-03 09:53:54'),
(31, 77, 1000.00, 'Bet placed on India v South Africa (India)', 'DR', 9999000.00, 9998790.00, 'success', 0, '2025-12-03 09:54:24'),
(32, 77, 1000.00, 'Bet placed on India v South Africa (30 over runs IND(IND vs SA)adv)', 'DR', 9998790.00, 9997790.00, 'success', 0, '2025-12-03 09:54:49'),
(33, 77, 1000.00, 'Bet placed on India v South Africa (India)', 'DR', 9997790.00, 9996790.00, 'success', 0, '2025-12-03 09:56:56'),
(34, 64, 100.00, 'Bet placed on India v South Africa (India)', 'DR', 5900.00, 5800.00, 'success', 0, '2025-12-03 10:10:25'),
(35, 64, 1000.00, 'Bet placed on India v South Africa (India)', 'DR', 5800.00, 4800.00, 'success', 0, '2025-12-03 10:10:34'),
(36, 64, 500.00, 'Bet placed on India v South Africa (50 over run bhav IND 2)', 'DR', 4800.00, 4400.00, 'success', 0, '2025-12-03 10:10:39'),
(37, 64, 100.00, 'Bet placed on India v South Africa (South Africa)', 'DR', 4400.00, 4300.00, 'success', 0, '2025-12-03 10:11:00'),
(38, 7, 100.00, 'Bet placed on lucky7eu (Match ID: 107251203154203)', 'DR', 99246.75, 99146.75, 'success', 0, '2025-12-03 10:12:15'),
(39, 64, 100.00, 'Bet placed on India v South Africa (India)', 'DR', 4300.00, 4287.00, 'success', 0, '2025-12-03 10:19:33'),
(40, 64, 100.00, 'Bet placed on India v South Africa (India)', 'DR', 4287.00, 4274.00, 'success', 0, '2025-12-03 10:19:37'),
(41, 64, 500.00, 'Bet placed on India v South Africa (India)', 'DR', 4274.00, 3774.00, 'success', 0, '2025-12-03 10:21:25'),
(42, 64, 500.00, 'Bet placed on India v South Africa (India)', 'DR', 3774.00, 3709.00, 'success', 0, '2025-12-03 10:21:29'),
(43, 64, 500.00, 'Bet placed on India v South Africa (India)', 'DR', 3709.00, 3644.00, 'success', 0, '2025-12-03 10:21:32'),
(44, 64, 500.00, 'Bet placed on India v South Africa (India)', 'DR', 3644.00, 3579.00, 'success', 0, '2025-12-03 10:21:35'),
(45, 77, 5000.00, 'Bet placed on India v South Africa (India)', 'DR', 9996790.00, 9991790.00, 'success', 0, '2025-12-03 10:24:37'),
(46, 77, 5000.00, 'Bet placed on India v South Africa (India)', 'DR', 9991790.00, 9991190.00, 'success', 0, '2025-12-03 10:24:42'),
(47, 77, 500.00, 'Bet placed on India v South Africa (India)', 'DR', 9991190.00, 9990690.00, 'success', 0, '2025-12-03 10:25:09'),
(48, 77, 5000.00, 'Bet placed on India v South Africa (India)', 'DR', 9990690.00, 9990090.00, 'success', 0, '2025-12-03 10:25:22'),
(49, 77, 500.00, 'Bet placed on India v South Africa (South Africa)', 'DR', 9990090.00, 9989590.00, 'success', 0, '2025-12-03 10:25:53'),
(50, 7, 90146.00, 'Amount Withdrawn (to master)', 'DR', 99146.75, 9000.75, 'success', 1, '2025-12-03 10:54:10'),
(51, 6, 90146.00, 'Amount Credited for user withdrawal', 'CR', 0.00, 90146.00, 'success', 1, '2025-12-03 10:54:10'),
(52, 7, 100.00, 'Bet placed on Sydney Thunder W v Brisbane Heat W (Sydney Thunder W)', 'DR', 9000.75, 8900.75, 'success', 0, '2025-12-03 10:54:51'),
(53, 7, 1000.00, 'Bet placed on Sydney Thunder W v Brisbane Heat W (Sydney Thunder W)', 'DR', 8900.75, 7900.75, 'success', 0, '2025-12-03 10:56:59'),
(54, 7, 1000.00, 'Bet placed on New Zealand v West Indies (New Zealand)', 'DR', 7900.75, 6900.75, 'success', 0, '2025-12-03 11:01:24'),
(55, 7, 100.00, 'Bet placed on New Zealand v West Indies (New Zealand)', 'DR', 6900.75, 6895.25, 'success', 0, '2025-12-03 11:03:33'),
(56, 7, 1000.00, 'Bet placed on New Zealand v West Indies (New Zealand)', 'DR', 6895.25, 6840.25, 'success', 0, '2025-12-03 11:03:50'),
(57, 7, 1000.00, 'Bet placed on Biratnagar Kings v Lumbini Lions (Biratnagar Kings)', 'DR', 6840.25, 5590.25, 'success', 0, '2025-12-03 11:04:55'),
(58, 7, 5000.00, 'Bet placed on Biratnagar Kings v Lumbini Lions (Lumbini Lions)', 'DR', 5590.25, 2090.25, 'success', 0, '2025-12-03 11:08:42'),
(59, 77, 5000.00, 'Bet placed on Biratnagar Kings v Lumbini Lions (6 over runs LL)', 'DR', 9989590.00, 9984590.00, 'success', 0, '2025-12-03 11:52:04'),
(60, 77, 5000.00, 'Bet placed on India v South Africa (India)', 'DR', 9984590.00, 9979590.00, 'success', 0, '2025-12-03 11:52:32'),
(61, 77, 100000.00, 'Bet placed on India v South Africa (India)', 'DR', 9979590.00, 9879590.00, 'success', 0, '2025-12-03 11:53:09'),
(62, 7, 100.00, 'Bet placed on Biratnagar Kings v Lumbini Lions (1 over run LL)', 'DR', 2090.25, 1990.25, 'success', 0, '2025-12-03 12:00:21'),
(63, 7, 1000.00, 'Bet placed on India v South Africa (India)', 'DR', 1990.25, 1830.25, 'success', 0, '2025-12-03 12:07:15'),
(64, 77, 100000.00, 'Bet placed on India v South Africa (India)', 'DR', 9879590.00, 9779590.00, 'success', 0, '2025-12-03 12:22:34'),
(65, 7, 100.00, 'Bet placed on India v South Africa (South Africa)', 'DR', 1830.25, 1730.25, 'success', 0, '2025-12-03 12:22:53'),
(66, 77, 5000.00, 'Bet placed on India v South Africa (South Africa)', 'DR', 9779590.00, 9774590.00, 'success', 0, '2025-12-03 12:32:45'),
(67, 77, 5000.00, 'Bet placed on India v South Africa (India)', 'DR', 9774590.00, 9769590.00, 'success', 0, '2025-12-03 12:33:10'),
(68, 7, 100.00, 'Bet placed on India v South Africa (India)', 'DR', 1730.25, 1630.25, 'success', 0, '2025-12-03 12:33:22'),
(69, 7, 100.00, 'Bet placed on India v South Africa (India)', 'DR', 1630.25, 1530.25, 'success', 0, '2025-12-03 12:38:13'),
(70, 7, 100.00, 'Bet placed on India v South Africa (India)', 'DR', 1530.25, 1430.25, 'success', 0, '2025-12-03 12:39:08'),
(71, 7, 100.00, 'Bet placed on India v South Africa (South Africa)', 'DR', 1430.25, 1330.25, 'success', 0, '2025-12-03 12:41:57'),
(72, 7, 100.00, 'Bet placed on New Zealand v West Indies (New Zealand)', 'DR', 1330.25, 1230.25, 'success', 0, '2025-12-04 03:35:35'),
(73, 7, 100.00, 'Bet placed on Pokhara Avengers v Kathmandu Gurkhas (Kathmandu Gurkhas)', 'DR', 1230.25, 1130.25, 'success', 0, '2025-12-04 08:36:34'),
(74, 7, 100.00, 'Bet placed on Australia v England (Australia)', 'DR', 1130.25, 1030.25, 'success', 0, '2025-12-04 08:55:16'),
(75, 7, 100.00, 'Bet placed on Australia v England (Australia)', 'DR', 1030.25, 930.25, 'success', 0, '2025-12-04 09:54:06'),
(76, 7, 100.00, 'Bet placed on Australia v England (Australia)', 'DR', 930.25, 843.25, 'success', 0, '2025-12-04 10:25:32'),
(77, 7, 100.00, 'Bet placed on Australia v England (Australia)', 'DR', 843.25, 772.25, 'success', 0, '2025-12-04 10:40:47'),
(78, 7, 100.00, 'Bet placed on Sudurpaschim Royals v Chitwan Rhinos (Sudurpaschim Royals)', 'DR', 772.25, 672.25, 'success', 0, '2025-12-04 10:49:39'),
(79, 7, 100.00, 'Bet placed on Sudurpaschim Royals v Chitwan Rhinos (Sudurpaschim Royals)', 'DR', 672.25, 618.25, 'success', 0, '2025-12-04 10:50:39'),
(80, 7, 500.00, 'Bet placed on Australia v England (Australia)', 'DR', 618.25, 118.25, 'success', 0, '2025-12-04 11:01:48'),
(81, 7, 500.00, 'Bet placed on Australia v England (Australia)', 'DR', 10000.00, 9650.00, 'success', 0, '2025-12-04 11:19:00'),
(82, 7, 500.00, 'Bet placed on Australia v England (Australia)', 'DR', 9650.00, 9150.00, 'success', 0, '2025-12-04 11:20:55'),
(83, 7, 500.00, 'Bet placed on Australia v England (Australia)', 'DR', 9150.00, 8650.00, 'success', 0, '2025-12-04 11:23:08'),
(84, 7, 500.00, 'Bet placed on Australia v England (Australia)', 'DR', 8650.00, 8260.00, 'success', 0, '2025-12-04 11:23:32'),
(85, 7, 500.00, 'Bet placed on Australia v England (Australia)', 'DR', 8260.00, 7760.00, 'success', 0, '2025-12-04 11:24:19'),
(86, 7, 100.00, 'Bet placed on Australia v England (Australia)', 'DR', 7760.00, 7660.00, 'success', 0, '2025-12-04 11:24:36'),
(87, 7, 100.00, 'Bet placed on Odisha v Railways (Railways)', 'DR', 7660.00, 7560.00, 'success', 0, '2025-12-04 11:25:35'),
(88, 7, 100.00, 'Bet placed on Odisha v Railways (Odisha)', 'DR', 7560.00, 7460.00, 'success', 0, '2025-12-04 11:26:22'),
(89, 7, 100.00, 'Bet placed on Odisha v Railways (Railways)', 'DR', 7460.00, 7422.00, 'success', 0, '2025-12-04 11:27:54'),
(90, 7, 100.00, 'Bet placed on Odisha v Railways (Odisha)', 'DR', 7422.00, 7128.00, 'success', 0, '2025-12-04 11:29:02'),
(91, 7, 1000.00, 'Bet placed on Tamil Nadu v Tripura (Tamil Nadu)', 'DR', 7128.00, 6128.00, 'success', 0, '2025-12-04 11:40:40'),
(92, 7, 100.00, 'Bet placed on Tamil Nadu v Tripura (Tripura)', 'DR', 6128.00, 6058.00, 'success', 0, '2025-12-04 11:41:58'),
(93, 77, 200000.00, 'Bet placed on Tamil Nadu v Tripura (Tamil Nadu)', 'DR', 9769590.00, 9569590.00, 'success', 0, '2025-12-04 13:39:28'),
(94, 77, 200000.00, 'Bet placed on Tamil Nadu v Tripura (Tamil Nadu)', 'DR', 9569590.00, 9559590.00, 'success', 0, '2025-12-04 13:40:02'),
(95, 77, 5000.00, 'Bet placed on Tamil Nadu v Tripura (Tripura)', 'DR', 9559590.00, 9554590.00, 'success', 0, '2025-12-04 13:40:37'),
(96, 77, 10000.00, 'Bet placed on Tamil Nadu v Tripura (15 over runs TRI)', 'DR', 9554590.00, 9544590.00, 'success', 0, '2025-12-04 13:51:42'),
(97, 77, 300000.00, 'Bet placed on Tamil Nadu v Tripura (Tamil Nadu)', 'DR', 9544590.00, 9244590.00, 'success', 0, '2025-12-04 13:56:32'),
(98, 7, 100.00, 'Bet placed on Gulf Giants v MI Emirates (20 over runs MIE(GG vs MIE)adv)', 'DR', 6058.00, 5958.00, 'success', 0, '2025-12-04 14:37:40'),
(99, 7, 100.00, 'Bet placed on Gulf Giants v MI Emirates (Gulf Giants)', 'DR', 5958.00, 5858.00, 'success', 0, '2025-12-04 14:38:56'),
(100, 7, 100.00, 'Bet placed on Gulf Giants v MI Emirates (Gulf Giants)', 'DR', 5858.00, 5741.00, 'success', 0, '2025-12-04 14:39:07'),
(101, 7, 100.00, 'Bet placed on Gulf Giants v MI Emirates (MI Emirates)', 'DR', 5741.00, 5651.00, 'success', 0, '2025-12-04 14:40:13'),
(102, 7, 5000.00, 'Bet placed on Gulf Giants v MI Emirates (Gulf Giants)', 'DR', 5651.00, 651.00, 'success', 0, '2025-12-04 14:57:58'),
(103, 63, 500000.00, 'Bet placed on Gulf Giants v MI Emirates (Gulf Giants)', 'DR', 900000.00, 545000.00, 'success', 0, '2025-12-04 15:00:09'),
(104, 63, 100000.00, 'Bet placed on Gulf Giants v MI Emirates (Gulf Giants)', 'DR', 545000.00, 445000.00, 'success', 0, '2025-12-04 15:02:08'),
(105, 63, 100000.00, 'Bet placed on Gulf Giants v MI Emirates (Gulf Giants)', 'DR', 445000.00, 345000.00, 'success', 0, '2025-12-04 15:02:13'),
(106, 63, 100000.00, 'Bet placed on Gulf Giants v MI Emirates (Gulf Giants)', 'DR', 345000.00, 245000.00, 'success', 0, '2025-12-04 15:02:15'),
(107, 63, 100000.00, 'Bet placed on Gulf Giants v MI Emirates (Gulf Giants)', 'DR', 245000.00, 145000.00, 'success', 0, '2025-12-04 15:02:45'),
(108, 63, 50000.00, 'Bet placed on Gulf Giants v MI Emirates (MI Emirates)', 'DR', 145000.00, 111000.00, 'success', 0, '2025-12-04 16:16:59'),
(109, 7, 100.00, 'Bet placed on New Zealand v West Indies (55 over run WI 2)', 'DR', 651.00, 551.00, 'success', 0, '2025-12-05 03:51:13'),
(110, 7, 500.00, 'Bet placed on Australia v England (1st over run AUS(AUS vs ENG)adv)', 'DR', 551.00, 51.00, 'success', 0, '2025-12-05 04:19:19'),
(111, 7, 1000.00, 'Amount Deposited (from master)', 'CR', 51.00, 1051.00, 'success', 1, '2025-12-05 04:37:56'),
(112, 6, 1000.00, 'Amount Deducted for user deposit', 'DR', 90146.00, 89146.00, 'success', 1, '2025-12-05 04:37:56'),
(113, 63, 5000.00, 'Bet placed on Australia v England (12 over run AUS)', 'DR', 111000.00, 106000.00, 'success', 0, '2025-12-05 05:16:51'),
(114, 63, 5000.00, 'Bet placed on Australia v England (13 over run AUS)', 'DR', 106000.00, 101000.00, 'success', 0, '2025-12-05 05:19:29'),
(115, 63, 10000.00, 'Bet placed on Australia v England (Australia)', 'DR', 101000.00, 91000.00, 'success', 0, '2025-12-05 05:53:58'),
(116, 63, 10000.00, 'Bet placed on Australia v England (Australia)', 'DR', 91000.00, 86200.00, 'success', 0, '2025-12-05 05:54:06'),
(117, 63, 50000.00, 'Bet placed on Australia v England (Australia)', 'DR', 86200.00, 36200.00, 'success', 0, '2025-12-05 05:54:13'),
(118, 63, 500.00, 'Bet placed on Australia v England (26 over run AUS)', 'DR', 36200.00, 35700.00, 'success', 0, '2025-12-05 07:03:51'),
(119, 77, 100000.00, 'Bet placed on Adelaide Strikers W v Hobart Hurricanes W (Hobart Hurricanes W)', 'DR', 9244590.00, 9144590.00, 'success', 0, '2025-12-05 08:33:55'),
(120, 77, 5000.00, 'Bet placed on Adelaide Strikers W v Hobart Hurricanes W (10 over runs AS W(AS W vs HH W)adv)', 'DR', 9144590.00, 9139590.00, 'success', 0, '2025-12-05 08:37:31'),
(121, 77, 500.00, 'Bet placed on Adelaide Strikers W v Hobart Hurricanes W (10 over runs AS W(AS W vs HH W)adv)', 'DR', 9139590.00, 9139090.00, 'success', 0, '2025-12-05 08:38:08'),
(122, 77, 100000.00, 'Bet placed on Adelaide Strikers W v Hobart Hurricanes W (Hobart Hurricanes W)', 'DR', 9139090.00, 9039090.00, 'success', 0, '2025-12-05 08:38:40'),
(123, 7, 100.00, 'Bet placed on Australia v England (Australia)', 'DR', 1051.00, 951.00, 'success', 0, '2025-12-05 08:48:09'),
(124, 7, 100.00, 'Bet placed on Australia v England (Australia)', 'DR', 951.00, 912.00, 'success', 0, '2025-12-05 08:48:18'),
(125, 7, 100.00, 'Bet placed on Australia v England (Australia)', 'DR', 912.00, 812.00, 'success', 0, '2025-12-05 09:01:08'),
(126, 7, 100.00, 'Bet placed on Australia v England (Australia)', 'DR', 812.00, 773.00, 'success', 0, '2025-12-05 09:01:14'),
(127, 7, 100.00, 'Bet placed on Australia v England (45 over run AUS)', 'DR', 773.00, 673.00, 'success', 0, '2025-12-05 09:01:28'),
(128, 7, 100.00, 'Bet placed on Australia v England (45 over run AUS)', 'DR', 673.00, 573.00, 'success', 0, '2025-12-05 09:01:38'),
(129, 7, 100.00, 'Bet placed on teen20 (Match ID: 102251205151258)', 'DR', 573.00, 473.00, 'success', 0, '2025-12-05 09:43:05'),
(130, 7, 198.00, 'Winnings from teen20 (Match ID: 102251205151258)', 'CR', 473.00, 671.00, 'success', 0, '2025-12-05 09:44:02'),
(131, 77, 5000.00, 'Bet placed on Desert Vipers v Abu Dhabi Knight Riders (Abu Dhabi Knight Riders)', 'DR', 9039090.00, 9034090.00, 'success', 0, '2025-12-05 15:56:04'),
(132, 63, 25000.00, 'Bet placed on Desert Vipers v Abu Dhabi Knight Riders (Desert Vipers)', 'DR', 35700.00, 17950.00, 'success', 0, '2025-12-05 16:38:29'),
(133, 63, 5000.00, 'Bet placed on Desert Vipers v Abu Dhabi Knight Riders (Desert Vipers)', 'DR', 17950.00, 12950.00, 'success', 0, '2025-12-05 16:40:27'),
(134, 63, 5000.00, 'Bet placed on Desert Vipers v Abu Dhabi Knight Riders (Desert Vipers)', 'DR', 12950.00, 7950.00, 'success', 0, '2025-12-05 16:40:31'),
(135, 63, 5000.00, 'Bet placed on Desert Vipers v Abu Dhabi Knight Riders (Desert Vipers)', 'DR', 7950.00, 2950.00, 'success', 0, '2025-12-05 16:40:34'),
(136, 7, 100.00, 'Bet placed on New Zealand v West Indies (The Draw)', 'DR', 671.00, 571.00, 'success', 0, '2025-12-06 03:57:43'),
(137, 63, 500.00, 'Bet placed on New Zealand v West Indies (The Draw)', 'DR', 2950.00, 2450.00, 'success', 0, '2025-12-06 04:37:49'),
(138, 63, 3000.00, 'Bet placed on Australia v England (Australia)', 'DR', 2950.00, -50.00, 'success', 0, '2025-12-06 05:49:23'),
(139, 7, 100.00, 'Bet placed on India v South Africa (India)', 'DR', 571.00, 471.00, 'success', 0, '2025-12-06 08:32:33'),
(140, 7, 100.00, 'Bet placed on India v South Africa (8 over run SA)', 'DR', 471.00, 371.00, 'success', 0, '2025-12-06 08:38:26'),
(141, 7, 100.00, 'Bet won on India v South Africa', 'CR', 371.00, 471.00, 'success', 0, '2025-12-06 11:00:13'),
(142, 7, 100.00, 'Bet won on India v South Africa', 'CR', 471.00, 571.00, 'success', 0, '2025-12-06 11:01:41'),
(143, 7, 100.00, 'Bet won on India v South Africa', 'CR', 571.00, 671.00, 'success', 0, '2025-12-06 11:06:55'),
(144, 7, 100.00, 'Bet won on India v South Africa', 'CR', 671.00, 771.00, 'success', 0, '2025-12-06 11:10:06'),
(145, 7, 100.00, 'Bet won on India v South Africa', 'CR', 771.00, 871.00, 'success', 0, '2025-12-06 11:14:43');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `image` varchar(255) NOT NULL DEFAULT 'https://admin.stream4video.com/photo/profile_img/default_img.png',
  `username` varchar(32) DEFAULT NULL,
  `mobile` varchar(16) DEFAULT NULL,
  `email` varchar(32) DEFAULT NULL,
  `password` varchar(16) DEFAULT NULL,
  `wallet` double(10,2) NOT NULL DEFAULT 0.00,
  `dob` varchar(64) DEFAULT NULL,
  `gender` varchar(32) DEFAULT NULL,
  `role` int(11) NOT NULL COMMENT '1=comp,2=msterAdmin,3=superAdmin,4=Admin,5=subAdmin,6=agent,7=client',
  `token` longtext DEFAULT NULL,
  `master_user` varchar(111) DEFAULT NULL COMMENT 'parent_id',
  `self_amount_limit` double(20,2) NOT NULL DEFAULT 0.00 COMMENT 'percentage amount limit',
  `self_share` double(5,2) DEFAULT 0.00 COMMENT 'share Percentage',
  `Match_comission` double(20,2) NOT NULL DEFAULT 0.00 COMMENT 'match se kitna commission aaya hai',
  `cassino_comission` double(20,2) NOT NULL DEFAULT 0.00 COMMENT 'cassino se kitna commission aaya hai',
  `session_comission` double(20,2) NOT NULL DEFAULT 0.00 COMMENT 'session se kitna commission aaya hai',
  `status` int(11) NOT NULL DEFAULT 1 COMMENT '1= active,0=inactive',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `matchBet` int(11) NOT NULL DEFAULT 1,
  `sessionBet` int(11) NOT NULL DEFAULT 1,
  `casinoBet` int(11) NOT NULL DEFAULT 1,
  `forcedBlock` tinyint(4) NOT NULL DEFAULT 0,
  `forcedBy` int(11) DEFAULT NULL,
  `blockedLevel` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `image`, `username`, `mobile`, `email`, `password`, `wallet`, `dob`, `gender`, `role`, `token`, `master_user`, `self_amount_limit`, `self_share`, `Match_comission`, `cassino_comission`, `session_comission`, `status`, `created_at`, `updated_at`, `matchBet`, `sessionBet`, `casinoBet`, `forcedBlock`, `forcedBy`, `blockedLevel`) VALUES
(1, 'Company', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'company', '1234567890', 'fastplay247@gmail.com', '1234', 0.00, '2025-01-01', 'male', 1, 'ab53c29f992c468f50eafca1', NULL, 12476536178.00, 100.00, 0.00, 0.00, 0.00, 1, '2025-11-17 07:14:27', '2025-12-03 09:41:17', 1, 1, 1, 0, NULL, NULL),
(2, 'super admin 1', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'SAD102', NULL, NULL, '1234', 0.00, NULL, NULL, 2, '8a92bebb5a4844e42d80', 'company', 949000.00, 90.00, 1.00, 1.00, 1.00, 1, '2025-11-17 07:14:27', '2025-12-01 04:52:15', 1, 1, 1, 0, NULL, 0),
(3, 'admin master 1', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'AD103', NULL, NULL, '1234', 0.00, NULL, NULL, 3, '9d8d945471720055476364258', 'SAD102', 89999.00, 80.00, 1.00, 1.00, 1.00, 1, '2025-11-17 07:16:52', '2025-12-01 05:04:20', 1, 1, 1, 0, NULL, NULL),
(4, 'sub admin master 1', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'SM104', NULL, NULL, '1234', 0.00, NULL, NULL, 4, NULL, 'AD103', 1000001.00, 70.00, 1.00, 1.00, 1.00, 1, '2025-11-17 07:17:31', '2025-11-17 07:18:09', 1, 1, 1, 0, NULL, NULL),
(5, 'super agent 1', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'SAG105', NULL, NULL, '1234', 0.00, NULL, NULL, 5, NULL, 'SM104', 850000.00, 60.00, 1.00, 1.00, 1.00, 1, '2025-11-17 07:18:09', '2025-12-01 05:37:33', 1, 1, 1, 0, NULL, NULL),
(6, 'agent master 1', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'AG106', NULL, NULL, '1234', 0.00, NULL, NULL, 6, '0bc7717261910f597ae9', 'SAG105', 89146.00, 50.00, 1.00, 1.00, 1.00, 1, '2025-11-17 07:19:01', '2025-12-01 05:31:00', 1, 1, 1, 0, NULL, NULL),
(7, 'client1', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'CL107', NULL, NULL, '1234', 0.00, NULL, NULL, 7, '6243a4f3a59e698be2bf6f6c', 'AG106', 871.00, 0.00, 1.00, 1.00, 1.00, 1, '2025-11-17 07:19:39', '2025-11-17 07:19:39', 1, 1, 1, 0, NULL, NULL),
(59, 'admin master 1', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'AD108', NULL, NULL, '1234', 0.00, NULL, NULL, 3, NULL, 'SAD102', 50000.00, 90.00, 1.00, 1.00, 1.00, 1, '2025-12-01 04:52:15', '2025-12-01 04:52:15', 1, 1, 1, 0, NULL, NULL),
(60, 'sub admin master 1', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'SM160', NULL, NULL, '1234', 0.00, NULL, NULL, 4, NULL, 'AD103', 0.00, 80.00, 1.00, 1.00, 1.00, 1, '2025-12-01 05:04:20', '2025-12-01 05:09:55', 1, 1, 1, 0, NULL, NULL),
(61, 'super agent 1', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'SAG161', NULL, NULL, '1234', 0.00, NULL, NULL, 5, NULL, 'SM160', 1000.00, 79.00, 1.00, 1.00, 1.00, 1, '2025-12-01 05:09:55', '2025-12-01 05:26:59', 1, 1, 1, 0, NULL, NULL),
(62, 'agent 1', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'AG162', NULL, NULL, '1234', 0.00, NULL, NULL, 6, NULL, 'SAG161', 1000.00, 78.00, 1.00, 1.00, 1.00, 1, '2025-12-01 05:26:59', '2025-12-01 05:32:14', 1, 1, 1, 0, NULL, NULL),
(63, 'client', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'CL163', NULL, NULL, '1234', 0.00, NULL, NULL, 7, 'fb508099c834a674a9b8bae8f', 'AG106', -50.00, 0.00, 1.00, 1.00, 1.00, 1, '2025-12-01 05:31:00', '2025-12-01 05:31:00', 1, 1, 1, 0, NULL, NULL),
(64, 'client 2', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'CL164', NULL, NULL, '111', 0.00, NULL, NULL, 7, '7b1e6f6c13a9876f2a89e88d', 'AG162', 3579.00, 0.00, 1.00, 1.00, 1.00, 1, '2025-12-01 05:32:14', '2025-12-01 05:32:14', 1, 1, 1, 0, NULL, NULL),
(65, 'check agent', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'AG165', NULL, NULL, '1234', 0.00, NULL, NULL, 6, NULL, 'SAG105', 45000.00, 55.00, 1.00, 1.00, 1.00, 1, '2025-12-01 05:37:33', '2025-12-01 05:38:21', 1, 1, 1, 0, NULL, NULL),
(66, 'clcheck', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'CL166', NULL, NULL, '1111', 0.00, NULL, NULL, 7, '9043af1a64d95c847bae479c1', 'AG165', 5000.00, 0.00, 1.00, 1.00, 1.00, 0, '2025-12-01 05:38:21', '2025-12-01 05:38:21', 1, 1, 1, 0, NULL, 1),
(67, 'su check', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'SAD167', NULL, NULL, '1234', 0.00, NULL, NULL, 2, '4873dbe01fb91afb418cadcd4', 'company', 50000.00, 90.00, 10.00, 10.00, 10.00, 1, '2025-12-01 06:10:34', '2025-12-01 06:11:46', 1, 1, 1, 0, NULL, NULL),
(68, 'admin chh', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'AD168', NULL, NULL, '1234', 0.00, NULL, NULL, 3, NULL, 'SAD167', 50000.00, 90.00, 0.00, 0.00, 0.00, 1, '2025-12-01 06:11:46', '2025-12-01 06:11:46', 1, 1, 1, 0, NULL, NULL),
(69, 'DEMO K K', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'SAD169', NULL, NULL, 'abc123', 0.00, NULL, NULL, 2, '8bf0cba26106b215ddb83e', 'company', 10000000.00, 90.00, 2.00, 2.00, 3.00, 1, '2025-12-03 09:15:09', '2025-12-03 09:43:35', 1, 1, 1, 0, NULL, NULL),
(70, 'DEMO K K', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'SAD170', NULL, NULL, 'abc123', 0.00, NULL, NULL, 2, NULL, 'company', 100000000.00, 90.00, 2.00, 2.00, 3.00, 1, '2025-12-03 09:15:37', '2025-12-03 09:15:37', 1, 1, 1, 0, NULL, NULL),
(71, 'DEMO K K', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'SAD171', NULL, NULL, 'abc123', 0.00, NULL, NULL, 2, NULL, 'company', 100000000.00, 90.00, 2.00, 2.00, 3.00, 1, '2025-12-03 09:15:38', '2025-12-03 09:15:38', 1, 1, 1, 0, NULL, NULL),
(72, 'DEMO K K', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'SAD172', NULL, NULL, 'abc123', 0.00, NULL, NULL, 2, NULL, 'company', 10000000.00, 90.00, 2.00, 2.00, 3.00, 1, '2025-12-03 09:41:17', '2025-12-03 09:41:17', 1, 1, 1, 0, NULL, NULL),
(73, 'DEMO K K', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'AD173', NULL, NULL, 'abc123', 0.00, NULL, NULL, 3, NULL, 'SAD169', 10000000.00, 85.00, 2.00, 2.00, 3.00, 1, '2025-12-03 09:43:35', '2025-12-03 09:44:20', 1, 1, 1, 0, NULL, NULL),
(74, 'DEMO K K', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'SM174', NULL, NULL, 'abc123', 0.00, NULL, NULL, 4, NULL, 'AD173', 70000000.00, 85.00, 2.00, 2.00, 3.00, 1, '2025-12-03 09:44:20', '2025-12-03 09:46:27', 1, 1, 1, 0, NULL, NULL),
(75, 'DEMO K K', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'SAG175', NULL, NULL, 'abc123', 0.00, NULL, NULL, 5, NULL, 'SM174', 10000000.00, 85.00, 2.00, 2.00, 3.00, 1, '2025-12-03 09:45:29', '2025-12-03 09:47:50', 1, 1, 1, 0, NULL, NULL),
(76, 'DEMO K K', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'AG176', NULL, NULL, 'abc123', 0.00, NULL, NULL, 6, NULL, 'SAG175', 40000000.00, 85.00, 2.00, 2.00, 3.00, 1, '2025-12-03 09:47:50', '2025-12-03 09:48:21', 1, 1, 1, 0, NULL, NULL),
(77, 'DEMO K K', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'CL177', NULL, NULL, 'abc123', 0.00, NULL, NULL, 7, '7b6822cb98084ef92f426b32', 'AG176', 9034090.00, 0.00, 2.00, 2.00, 3.00, 1, '2025-12-03 09:48:21', '2025-12-03 09:48:21', 1, 1, 1, 0, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bets`
--
ALTER TABLE `bets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rules`
--
ALTER TABLE `rules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `settlement_adjustments`
--
ALTER TABLE `settlement_adjustments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `settlement_ledger`
--
ALTER TABLE `settlement_ledger`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sport_bets`
--
ALTER TABLE `sport_bets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_bet_setting`
--
ALTER TABLE `tbl_bet_setting`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_rollBack`
--
ALTER TABLE `tbl_rollBack`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_setting`
--
ALTER TABLE `tbl_setting`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_user_transaction`
--
ALTER TABLE `tbl_user_transaction`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_mobile_unique` (`mobile`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bets`
--
ALTER TABLE `bets`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `rules`
--
ALTER TABLE `rules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `settlement_adjustments`
--
ALTER TABLE `settlement_adjustments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `settlement_ledger`
--
ALTER TABLE `settlement_ledger`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `sport_bets`
--
ALTER TABLE `sport_bets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_bet_setting`
--
ALTER TABLE `tbl_bet_setting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_rollBack`
--
ALTER TABLE `tbl_rollBack`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_setting`
--
ALTER TABLE `tbl_setting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_user_transaction`
--
ALTER TABLE `tbl_user_transaction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=146;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
