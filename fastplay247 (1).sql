-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 13, 2025 at 12:12 PM
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
(1, 60, 'teen', 101251107122226, '2', 100.00, 'lost', 1.66, 'Player A', 0.00, 'L', '2025-11-07 06:54:56', '2025-11-07 06:56:38'),
(2, 60, 'teen', 101251107122621, '2', 500.00, 'lost', 1.80, 'Player A', 0.00, 'L', '2025-11-07 06:59:02', '2025-11-07 07:01:02'),
(3, 60, 'teen', 101251107122621, '1', 100.00, 'won', 1.30, 'Player A', 130.00, 'K', '2025-11-07 06:59:28', '2025-11-07 07:01:02'),
(4, 60, 'lucky7eu', 107251107123451, '1', 100.00, 'won', 2.00, 'Low Card', 200.00, 'L', '2025-11-07 07:05:17', '2025-11-07 07:06:01'),
(14, 60, 'aaa', 121251107151641, '4', 500.00, 'won', 1.83, 'Amar', 915.00, 'L', '2025-11-07 09:54:01', '2025-11-07 11:07:05'),
(15, 60, 'aaa', 121251107151641, '5', 100.00, 'won', 1.97, 'Amar', 197.00, 'L', '2025-11-07 09:54:32', '2025-11-07 11:07:24'),
(16, 60, 'teen20', 102251107163308, '1', 500.00, 'won', 1.98, 'Player A', 990.00, 'L', '2025-11-07 11:03:15', '2025-11-07 11:05:01'),
(17, 60, 'teen', 101251107163455, '1', 500.00, 'lost', 1.98, 'Player B', 0.00, 'L', '2025-11-07 11:05:03', '2025-11-07 11:09:02'),
(18, 60, 'teen20', 102251107163512, '1', 211.00, 'lost', 1.98, 'Player B', 0.00, 'L', '2025-11-07 11:05:33', '2025-11-07 11:07:02'),
(19, 60, 'dt20', 116251107163551, '3', 101.00, 'lost', 50.00, 'Tiger', 0.00, 'L', '2025-11-07 11:06:09', '2025-11-07 11:07:03'),
(20, 60, 'dt202', 117251107163626, '3', 121.00, 'lost', 50.00, 'Tiger', 0.00, 'L', '2025-11-07 11:06:34', '2025-11-07 11:08:03'),
(21, 60, 'dt202', 117251107163900, '3', 201.00, 'lost', 50.00, 'Tiger', 0.00, 'L', '2025-11-07 11:09:09', '2025-11-07 11:10:02'),
(22, 60, 'card32', 113251107164214, '4', 222.00, 'won', 2.08, 'Player 11', 461.76, 'B', '2025-11-07 11:12:22', '2025-11-07 11:14:02'),
(23, 60, 'lucky7eu', 107251107164227, '1', 1224.00, 'lost', 2.00, 'High Card', 0.00, 'L', '2025-11-07 11:12:35', '2025-11-07 11:13:02'),
(24, 60, 'aaa', 121251107164238, '1', 111.00, 'lost', 2.22, 'Akbar', 0.00, 'K', '2025-11-07 11:12:49', '2025-11-07 11:14:02'),
(25, 60, 'teen', 101251107172008, '1', 100.00, 'won', 1.98, 'Player A', 198.00, 'L', '2025-11-07 11:50:17', '2025-11-07 11:54:01'),
(26, 60, 'teen', 101251108101007, '1', 1000.00, 'lost', 1.34, 'Player B', 0.00, 'L', '2025-11-08 04:42:30', '2025-11-08 04:44:02'),
(27, 60, 'aaa', 121251108101800, '1', 1000.00, 'won', 2.12, 'Amar', 2120.00, 'L', '2025-11-08 04:48:06', '2025-11-08 04:49:02'),
(28, 60, 'teen', 101251109005353, '1', 500.00, 'lost', 1.61, 'Player B', 0.00, 'K', '2025-11-08 19:24:51', '2025-11-08 19:28:02'),
(29, 60, 'teen', 101251110185401, '2', 100.00, 'won', 1.44, 'Player B', 144.00, 'L', '2025-11-10 13:28:45', '2025-11-10 13:30:01'),
(30, 60, 'lucky7eu', 107251110235236, '1', 100.00, 'won', 2.00, 'Low Card', 200.00, 'L', '2025-11-10 18:22:47', '2025-11-10 18:24:02'),
(31, 110, 'dt20', 116251112143314, '3', 200.00, 'lost', 50.00, 'Dragon', 0.00, 'L', '2025-11-12 09:03:21', '2025-11-12 09:05:01'),
(32, 110, 'lucky7eu', 107251112145902, '1', 100.00, 'lost', 2.00, 'High Card', 0.00, 'L', '2025-11-12 09:29:22', '2025-11-12 09:30:02'),
(33, 110, 'lucky7eu', 107251112150155, '2', 100.00, 'won', 2.00, 'High Card', 200.00, 'L', '2025-11-12 09:32:18', '2025-11-12 09:33:02'),
(34, 110, 'aaa', 121251112151525, '3', 100.00, 'won', 2.12, 'Anthony', 212.00, 'L', '2025-11-12 09:45:54', '2025-11-12 09:47:02'),
(35, 110, 'aaa', 121251112151525, '4', 100.00, 'lost', 1.83, 'Anthony', 0.00, 'L', '2025-11-12 09:45:59', '2025-11-12 09:47:04'),
(36, 60, 'teen', 101251112213700, '1', 1000.00, 'lost', 1.92, 'Player B', 0.00, 'L', '2025-11-12 16:09:45', '2025-11-12 16:11:02'),
(37, 60, 'teen', 101251112214055, '1', 100.00, 'won', 1.15, 'Player A', 115.00, 'L', '2025-11-12 16:14:27', '2025-11-12 16:15:01'),
(38, 60, 'teen', 101251112223743, '1', 100.00, 'lost', 1.68, 'Player B', 0.00, 'L', '2025-11-12 17:09:57', '2025-11-12 17:12:02');

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
(1, '<!doctype html>\n<html lang=\"hi\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <title>Rules</title>\n</head>\n<style>\n    body {\n      font-family: Arial, sans-serif;\n      margin: 15px;\n      line-height: 1.6;\n      font-size: 15px;\n      background: #fff;\n      color: #000;\n    }\n    h2 {\n      margin-top: 25px;\n      font-size: 18px;\n      font-weight: bold;\n      text-transform: uppercase;\n    }\n</style>\n<body style=\"margin:0; padding:10px; font-family: sans-serif;\">\n<pre style=\"white-space: pre-wrap; font-family: inherit; font-size:14px; line-height:1.4;\">\n1. मैच टाई होने पर सभी फैंसी दांव मान्य होंगे।\n2. टॉस या मौसम की स्थिति से पहले सभी अग्रिम फैंसी निलंबित कर दी जाएंगी।\n3. तकनीकी त्रुटि या किसी भी परिस्थिति में किसी भी फैंसी को निलंबित कर दिया जाता है और परिणाम फिर से शुरू नहीं होता है, पिछले सभी दांव वैध होंगे (हार/जीत के आधार पर)।\n4. यदि किसी भी मामले में फैंसी में गलत दर दी गई है तो उस विशेष दांव को रद्द कर दिया जाएगा।\n5. किसी भी परिस्थिति में प्रबंधन का निर्णय सभी विनिमय वस्तुओं से संबंधित अंतिम होगा।\n6. यदि ग्राहक गलत तरीके से दांव लगाता है तो हम हटाने के लिए उत्तरदायी नहीं हैं, कोई बदलाव नहीं किया जाएगा और दांव को पुष्टि दांव माना जाएगा।\n7. किसी तकनीकी त्रुटि के कारण बाजार खुला है और परिणाम आ गया है, परिणाम के बाद के सभी दांव हटा दिए जाएंगे।\n8. हमारे एक्सचेंज में मैनुअल दांव स्वीकार नहीं किए जाते हैं।\n9. हमारा एक्सचेंज हमारे लाइव टीवी में 5 सेकंड की देरी प्रदान कर सकता है।\n10. एक बार जब हमारा एक्सचेंज उपयोगकर्ता नाम और पासवर्ड दे देता है तो पासवर्ड बदलना आपकी जिम्मेदारी है।\n11. पेनल्टी रन को किसी भी श्रेणी में नहीं गिना जाएगा।\n12. चेतावनी:- इस साइट पर लाइव स्कोर और अन्य डेटा तीसरे पक्ष के फ़ीड से प्राप्त किया जाता है और इसमें समय की देरी हो सकती है और/या गलत हो सकता है। यदि आप दांव लगाने के लिए इस डेटा पर भरोसा करते हैं, तो आप ऐसा अपने जोखिम पर करते हैं। हमारा एक्सचेंज इस डेटा पर निर्भरता के परिणामस्वरूप हुए नुकसान की जिम्मेदारी स्वीकार नहीं करता है।\n13. हमारा एक्सचेंज क्लाइंट आईडी के दुरुपयोग के लिए ज़िम्मेदार नहीं है।\n\n<h2>TEST\'s RULE</h2>\n1. Session:\n1. परीक्षण में पूरा सत्र मान्य।\n2. उदाहरण के लिए सत्र पूरा नहीं हुआ है: - भारत 60 ओवर रन सत्र भारत चल रहा है यदि भारतीय टीम 55 रन पर पारी घोषित या ऑलआउट करती है तो अगले 5 ओवर का सत्र इंग्लैंड की पारी में जारी रहेगा।\n3. पहले दिन पहला सत्र न्यूनतम 25 ओवर खेला जाएगा तभी परिणाम दिया जाएगा अन्यथा पहला दिन पहला सत्र हटा दिया जाएगा।\n4. पहला दिन दूसरा सत्र न्यूनतम 25 ओवर खेला जाएगा तभी परिणाम दिया जाएगा अन्यथा पहला दिन दूसरा सत्र हटा दिया जाएगा।\n5. पहले दिन का कुल रन न्यूनतम 80 ओवर खेला जाएगा तभी परिणाम दिया जाएगा अन्यथा पहले दिन का कुल रन हटा दिया जाएगा।\n6. टेस्ट मैच के दोनों अग्रिम सत्र मान्य हैं।\n\n2. Test Lambi:\n1. टेस्ट लांबी पारी में अनिवार्य 70 ओवर का खेल। यदि कोई भी टीम ऑल आउट या डिक्लेरेशन लंबी पारी मान्य है।\n2. उदाहरण के लिए सत्र पूरा नहीं हुआ है: - भारत 60 ओवर रन सत्र भारत चल रहा है यदि भारतीय टीम 55 रन पर पारी घोषित या ऑलआउट करती है तो अगले 5 ओवर का सत्र इंग्लैंड की पारी में जारी रहेगा।\n3. पहला दिन पहला सत्र न्यूनतम 25 ओवर खेला जाएगा तभी परिणाम दिया जाएगा अन्यथा पहला दिन पहला सत्र हटा दिया जाएगा.\n\n3. Test Batsman:\n1. यदि बल्लेबाज घायल हो जाता है तो उसे 34 रन बनाने होंगे, परिणाम 34 रन दिया जाएगा।\n2. बल्लेबाज 50/100 रन यदि बल्लेबाज घायल हो या घोषित हो तो परिणाम विशेष रन पर दिया जाएगा।\n3. अगले मेन आउट फैंसी में यदि खिलाड़ी घायल हो जाता है तो विशेष फैंसी हटा दी जाएगी।\n4. अग्रिम रूप से फैंसी ओपनिंग बल्लेबाज केवल तभी मान्य होते हैं जब वही बल्लेबाज ओपनिंग में आते हैं फैंसी मान्य होगी यदि एक बल्लेबाज को बदल दिया जाता है तो उस विशेष खिलाड़ी फैंसी को हटा दिया जाएगा।\n5. टेस्ट मैच में दोनों बल्लेबाजों के एडवांस फैंसी रन मान्य है।\n\n4. Test Partnership:\n1. साझेदारी में एक बल्लेबाज के घायल होने पर अगले बल्लेबाज के साथ साझेदारी जारी रखी जाती है।\n2. मौसम की स्थिति के कारण साझेदारी और खिलाड़ी की दौड़ या मैच रद्द होने पर परिणाम स्कोर के अनुसार दिया जाएगा।\n3. यदि दोनों खिलाड़ी अलग-अलग या एक जैसे हों तो अग्रिम साझेदारी मान्य है।\n4. टेस्ट मैच में दोनों एडवांस फैंसी पार्टनरशिप मान्य है।\n\n5. Other Fancy advance (test):\n1. चौका, छक्का, वाइड, विकेट, अतिरिक्त रन, कुल रन, उच्चतम ओवर और शीर्ष बल्लेबाज केवल तभी मान्य है जब 2 पारियां खेली जाएंगी अन्यथा अन्य सभी फैंसी हटा दिए जाएंगे।\n\n<h2>ODI\'s RULE</h2>\n1. Session:\n1. मैच के पहले ओवर का अग्रिम रन केवल पहली पारी का रन गिना जाएगा।\n2. बारिश या मैच रद्द होने की स्थिति में पूरा सत्र मान्य है, विशेष सत्र हटा दिया जाएगा।\n3. उदाहरण के लिए:- 35 ओवर की टीम ए किसी भी स्थिति में खेल रही है, टीम ए 33 ओवर में ऑलआउट हो गई है, टीम ए ने 150 रन बनाए हैं, सत्र का परिणाम विशेष रन पर मान्य है।\n4. अग्रिम सत्र केवल पहली पारी में मान्य है।\n\n2. 50 over runs:\n1. यदि 50 ओवर पूरे नहीं हुए तो मौसम या किसी भी स्थिति के कारण सभी दांव हटा दिए जाएंगे।\n2. अग्रिम 50 ओवर रन केवल पहली पारी में मान्य हैं।\n\n3. ODI Batsman runs:\n1. यदि बल्लेबाज घायल हो जाता है तो उसे 34 रन बनाने होंगे, परिणाम 34 रन दिया जाएगा।\n2. अगले मेन आउट फैंसी में यदि खिलाड़ी घायल हो जाता है तो विशेष फैंसी हटा दी जाएगी।\n3. अग्रिम रूप से फैंसी ओपनिंग बल्लेबाज केवल तभी मान्य हैं यदि वही बल्लेबाज ओपनिंग में आए हों फैंसी मान्य होगी यदि एक बल्लेबाज को बदला जाता है तो उस विशेष खिलाड़ी फैंसी को हटा दिया जाएगा।\n\n4. ODI Partnership runs:\n1. साझेदारी में एक बल्लेबाज के घायल होने पर अगले बल्लेबाज के साथ साझेदारी जारी रखी जाती है।\n2. यदि दोनों खिलाड़ी अलग-अलग या एक जैसे हों तो अग्रिम साझेदारी मान्य है।\n3. दोनों टीमों की अग्रिम साझेदारियाँ विशेष मैच में मान्य हैं।\n\n5. Other Fancy:\n1. चौका, छक्का, वाइड, विकेट, अतिरिक्त रन, कुल रन, उच्चतम ओवर और शीर्ष बल्लेबाज, मेडेन ओवर, कैच-आउट, नो-बॉल, रन-आउट, अर्धशतक और शतक मान्य हैं, केवल बारिश के कारण मैच पूरा हुआ है ओवर कम कर दिया गया है, अन्य सभी फैंसी हटा दिए जाएंगे।\n\n<h2>T20\'s RULE</h2>\n1. Session:\n1. मैच के पहले ओवर का अग्रिम रन केवल पहली पारी का रन गिना जाएगा।\n2. बारिश या मैच रद्द होने की स्थिति में पूरा सत्र मान्य है, विशेष सत्र हटा दिया जाएगा।\n3. उदाहरण के लिए:- 15 ओवर में टीम ए खेल रही है, किसी भी स्थिति में टीम ए 13 ओवर में ऑल-आउट हो गई है, टीम ए ने 100 रन बनाए हैं, सत्र का परिणाम विशेष रन पर मान्य है।\n4. अग्रिम सत्र केवल पहली पारी में मान्य है।\n\n2. 20 over runs:\n1. यदि 20 ओवर पूरा नहीं हुआ तो मौसम या किसी भी स्थिति के कारण सभी दांव हटा दिए जाएंगे।\n2. एडवांस 20 ओवर रन केवल पहली पारी में मान्य है।\n\n3. T20 batsman runs:\n1. यदि बल्लेबाज घायल हो जाता है तो उसे 34 रन बनाने होंगे, परिणाम 34 रन दिया जाएगा।\n2. अगले मेन आउट फैंसी में यदि खिलाड़ी घायल हो जाता है तो विशेष फैंसी हटा दी जाएगी।\n3. अग्रिम रूप से फैंसी ओपनिंग बल्लेबाज केवल तभी मान्य होते हैं जब वही बल्लेबाज ओपनिंग में आते हैं फैंसी मान्य होगी यदि एक बल्लेबाज को बदल दिया जाता है तो उस विशेष खिलाड़ी फैंसी को हटा दिया जाएगा।\n\n4. T20 partnership runs:\n1. अग्रिम रूप से फैंसी ओपनिंग बल्लेबाज केवल तभी मान्य होते हैं जब वही बल्लेबाज ओपनिंग में आते हैं फैंसी मान्य होगी यदि एक बल्लेबाज को बदल दिया जाता है तो उस विशेष खिलाड़ी फैंसी को हटा दिया जाएगा।\n2. यदि दोनों खिलाड़ी अलग-अलग या एक जैसे हों तो अग्रिम साझेदारी मान्य है।\n3. दोनों टीमों की अग्रिम साझेदारियाँ विशेष मैच में मान्य हैं।\n\n5. Other Fancy:\n1. टी-20, एकदिवसीय और टेस्ट मैच में यदि मौजूदा पारी के खिलाड़ी और साझेदारी के बीच मैच चल रहा है तो मैच रद्द कर दिया गया है या छोड़ दिया गया है, उस स्थिति में सभी मौजूदा खिलाड़ी और साझेदारी के परिणाम मान्य हैं।\n2. चौका, छक्का, वाइड, विकेट, अतिरिक्त रन, कुल रन, उच्चतम ओवर और शीर्ष बल्लेबाज, मेडेन ओवर, कैच-आउट, नो-बॉल, रन-आउट, पचास और शतक मान्य हैं, केवल बारिश के कारण मैच पूरा हुआ है ओवर कम कर दिया गया है, अन्य सभी फैंसी हटा दिए जाएंगे। पहला 6 ओवर डॉट बॉल और 20 ओवर डॉट बॉल फैंसी ही पहली पारी के लिए मान्य है।\n3. उदाहरण के लिए: प्रथम ओवर रन परिदृश्य का गुणन इंग्लैंड प्रथम ओवर रन 5 और भारत प्रथम ओवर रन 0 है, परिणाम 0 रन के रूप में घोषित किया जाएगा। यह नियम गुणन संबंधी सभी कल्पनाओं में लागू होते हैं।\n4. किसी भी टीम की गेंदों पर पहला विकेट गिरने का मतलब है कि किसी भी टीम का पहला विकेट कितनी गेंदों में गिरता है, उस विशेष फैंसी को कम से कम एक गेंद खेलनी होगी अन्यथा दांव हटा दिए जाएंगे।\n5. किसी भी टीम का पहला wicket दोनों पारियों में मान्य होगा।\n6. किसी भी टीम को 50 रनों के लिए कितनी गेंदें चाहिए मतलब किसी भी टीम ने कितनी गेंदों में 50 रन हासिल किए, उस विशेष फैंसी को कम से कम एक गेंद खेलनी होगी अन्यथा वह फैंसी दांव हटा दिए जाएंगे।\n7. किसी भी टीम के लिए 50 रन के लिए कितनी गेंदें केवल पहली पारी में मान्य हैं।\n8. उदाहरण के लिए:- किसी भी टीम का स्कोर 5.5 ओवर में 49 रन है यदि अगली गेंद वाइड या नो-बॉल है तो 50 रन पूरे हो गए तो परिणाम 35 गेंदों में घोषित कर दिया जाएगा।\n9. किसी भी टीम के फैंसी द्वारा पारी के पहले 6 बाउंड्री रनों की गिनती केवल रन के अनुसार ही की जाएगी, कम से कम 6 ओवर खेले जाने चाहिए, अन्यथा उस फैंसी को हटा दिया जाएगा।\n10. पहली पारी में 6 ओवर बाउंड्री रन, किसी भी टीम के रन जैसे वाइड, नो-बॉल, लेग-बाई, बाई और ओवर थ्रो रन को इस फैंसी में नहीं गिना जाता है।\n11. किसी भी बल्लेबाज को कितनी गेंदों का सामना करना पड़ता है इसका मतलब है कि किसी भी बल्लेबाज ने कितनी गेंदें खेली हैं, उस विशेष फैंसी में कम से कम एक गेंद खेलनी होगी अन्यथा वह फैंसी दांव हटा दिए जाएंगे।\n12. किसी भी बल्लेबाज द्वारा दोनों पारियों में कितनी गेंदों का सामना किया गया मान्य है।\n\n15. Concussion in Test:-\n1. यदि सत्र अधूरा है, तो परीक्षण परिदृश्य में एक सत्र के सभी दांव हटा दिए जाएंगे। उदाहरण के लिए पारी घोषित या खराब रोशनी या किसी अन्य स्थिति के कारण मैच निलंबित।\n</pre>\n</body>\n</html>');

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
  `win_amount` double NOT NULL DEFAULT 0,
  `bet_status` enum('pending','won','lost') DEFAULT 'pending',
  `bet_message` varchar(255) DEFAULT NULL,
  `status` varchar(32) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `bet_value` double(10,2) DEFAULT NULL,
  `bet_choice` varchar(255) DEFAULT NULL,
  `gmId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `sport_bets`
--

INSERT INTO `sport_bets` (`id`, `user_id`, `event_id`, `event_name`, `market_id`, `market_name`, `market_type`, `bet_amount`, `win_amount`, `bet_status`, `bet_message`, `status`, `created_at`, `bet_value`, `bet_choice`, `gmId`) VALUES
(1, 60, 4, 'WBBL', 198329358977, 'Highest Run Scorer Runs of WBBL', 'fancy', 100.00, 0, 'pending', 'bets saved successfully', 'pending', '2025-11-06 05:32:49', 400.00, 'K', '816538183'),
(2, 60, 4, 'New Zealand v West Indies', 8530084934081, 'New Zealand', 'match', 10.00, 0, 'lost', 'New Zealand', 'pending', '2025-11-06 06:38:15', 1.38, 'L', '819408679'),
(3, 60, 4, 'New Zealand v West Indies', 8530084934081, 'New Zealand', 'match', 10.00, 0, 'lost', 'New Zealand', 'pending', '2025-11-06 06:38:16', 1.38, 'L', '819408679'),
(4, 60, 4, 'New Zealand v West Indies', 8530084934081, 'New Zealand', 'match', 1.00, 0, 'lost', 'New Zealand', 'pending', '2025-11-06 06:38:52', 1.38, 'L', '819408679'),
(5, 60, 4, 'New Zealand v West Indies', 8530084934081, 'New Zealand', 'match', 1.00, 0, 'lost', 'New Zealand', 'pending', '2025-11-06 06:39:08', 1.38, 'L', '819408679'),
(6, 60, 4, 'New Zealand v West Indies', 8530084934081, 'New Zealand', 'match', 1.00, 0, 'lost', 'New Zealand', 'pending', '2025-11-06 06:39:08', 1.38, 'L', '819408679'),
(7, 60, 4, 'New Zealand v West Indies', 8530084934081, 'New Zealand', 'match', 1.00, 0, 'lost', 'New Zealand', 'pending', '2025-11-06 06:39:09', 1.38, 'L', '819408679'),
(8, 60, 4, 'New Zealand v West Indies', 8530084934081, 'New Zealand', 'match', 1.00, 0, 'lost', 'New Zealand', 'pending', '2025-11-06 06:39:10', 1.38, 'L', '819408679'),
(9, 60, 4, 'New Zealand v West Indies', 8530084934081, 'New Zealand', 'match', 1.00, 0, 'lost', 'New Zealand', 'pending', '2025-11-06 06:39:18', 1.38, 'L', '819408679'),
(10, 60, 4, 'New Zealand v West Indies', 8530084934081, 'New Zealand', 'match', 1.00, 0, 'lost', 'New Zealand', 'pending', '2025-11-06 06:39:19', 1.38, 'L', '819408679'),
(11, 60, 4, 'New Zealand v West Indies', 8530084934081, 'New Zealand', 'match', 5.00, 0, 'lost', 'New Zealand', 'pending', '2025-11-06 06:39:26', 1.38, 'L', '819408679'),
(12, 60, 4, 'New Zealand v West Indies', 623114223124, '20 over runs NZ 2', 'fancy', 1000.00, 0, 'lost', '207', 'pending', '2025-11-06 06:41:39', 192.00, 'L', '819408679'),
(13, 60, 4, 'New Zealand v West Indies', 623114223124, '15 over runs NZ(NZ vs WI)adv', 'fancy', 100.00, 0, 'lost', '207', 'pending', '2025-11-06 07:24:40', 134.00, 'K', '819408679'),
(14, 60, 4, 'New Zealand v West Indies', 623114223124, '15 over runs NZ(NZ vs WI)adv', 'fancy', 100.00, 0, 'lost', '207', 'pending', '2025-11-06 07:24:42', 134.00, 'K', '819408679'),
(15, 60, 4, 'New Zealand v West Indies', 8530084934081, 'New Zealand', 'match', 5.00, 0, 'lost', 'New Zealand', 'pending', '2025-11-06 07:25:46', 1.35, 'L', '819408679'),
(16, 60, 4, 'New Zealand v West Indies', 8530084934081, 'New Zealand', 'match', 5.00, 0, 'lost', 'New Zealand', 'pending', '2025-11-06 07:26:07', 1.35, 'L', '819408679'),
(17, 60, 4, 'New Zealand v West Indies', 8530084934081, 'New Zealand', 'match', 1000.00, 0, 'lost', 'New Zealand', 'pending', '2025-11-06 07:28:54', 1.25, 'L', '819408679'),
(18, 60, 4, 'New Zealand v West Indies', 8530084934081, 'New Zealand', 'match', 500.00, 0, 'lost', 'New Zealand', 'pending', '2025-11-06 07:32:19', 1.18, 'L', '819408679'),
(19, 60, 4, 'New Zealand v West Indies', 8530084934081, 'New Zealand', 'match', 1000.00, 0, 'lost', 'New Zealand', 'pending', '2025-11-06 07:33:14', 1.16, 'L', '819408679'),
(20, 60, 4, 'New Zealand v West Indies', 8530084934081, 'New Zealand', 'match', 100.00, 0, 'lost', 'New Zealand', 'pending', '2025-11-06 07:56:00', 1.21, 'L', '819408679'),
(21, 60, 4, 'Pakistan v South Africa', 7959412233769, 'Pakistan', 'match', 100.00, 0, 'lost', 'South Africa', 'pending', '2025-11-06 10:17:36', 1.60, 'L', '604536002'),
(22, 60, 4, 'Pakistan v South Africa', 325199885132, '50 over runs PAK 2', 'fancy', 100.00, 0, 'lost', '269', 'pending', '2025-11-06 10:17:43', 284.00, 'K', '604536002'),
(23, 60, 4, 'Pakistan v South Africa', 325199885132, 'How many balls face by Salman Agha', 'fancy', 100.00, 0, 'lost', '269', 'pending', '2025-11-06 10:36:04', 47.00, 'L', '604536002'),
(24, 60, 4, 'Pakistan v South Africa', 325199885132, 'How many balls face by Salman Agha', 'fancy', 200.00, 0, 'lost', '269', 'pending', '2025-11-06 10:41:53', 52.00, 'K', '604536002'),
(25, 60, 4, 'Pakistan v South Africa', 7959412233769, 'Pakistan', 'match', 222.00, 0, 'lost', 'South Africa', 'pending', '2025-11-06 10:42:59', 2.84, 'K', '604536002'),
(26, 60, 4, 'Pakistan v South Africa', 325199885132, 'How many balls face by S Ayub(PAK vs SA)adv', 'fancy', 500.00, 0, 'lost', '269', 'pending', '2025-11-06 11:10:07', 79.00, 'K', '604536002'),
(27, 60, 4, 'Pakistan v South Africa', 7959412233769, 'South Africa', 'match', 5000.00, 0, 'lost', 'South Africa', 'pending', '2025-11-06 12:23:01', 1.73, 'L', '604536002'),
(28, 60, 4, 'Pakistan v South Africa', 325199885132, '35 over run PAK', 'fancy', 1000.00, 0, 'lost', '269', 'pending', '2025-11-06 12:23:23', 156.00, 'L', '604536002'),
(29, 60, 4, 'Pakistan v South Africa', 325199885132, '35 over run PAK', 'fancy', 25000.00, 0, 'lost', '269', 'pending', '2025-11-06 12:25:15', 155.00, 'L', '604536002'),
(30, 60, 4, 'Pakistan v South Africa', 325199885132, '35 over run PAK', 'fancy', 5000.00, 0, 'lost', '269', 'pending', '2025-11-06 12:25:23', 155.00, 'L', '604536002'),
(31, 60, 4, 'Pakistan v South Africa', 7959412233769, 'South Africa', 'match', 5000.00, 0, 'lost', 'South Africa', 'pending', '2025-11-06 12:28:22', 1.82, 'L', '604536002'),
(32, 60, 4, 'Pakistan v South Africa', 7959412233769, 'South Africa', 'match', 50000.00, 0, 'lost', 'South Africa', 'pending', '2025-11-06 12:28:31', 1.82, 'L', '604536002'),
(33, 60, 4, 'Pakistan v South Africa', 325199885132, '35 over run PAK', 'fancy', 5000.00, 0, 'lost', '269', 'pending', '2025-11-06 12:28:52', 157.00, 'L', '604536002'),
(34, 60, 4, 'Pakistan v South Africa', 7959412233769, 'Pakistan', 'match', 5000.00, 0, 'lost', 'South Africa', 'pending', '2025-11-06 13:35:54', 1.87, 'K', '604536002'),
(35, 60, 4, 'Pakistan v South Africa', 325199885132, '10 over run SA', 'fancy', 50000.00, 0, 'lost', '269', 'pending', '2025-11-06 14:37:37', 58.00, 'L', '604536002'),
(36, 60, 4, 'Pakistan v South Africa', 325199885132, '10 over run SA', 'fancy', 50000.00, 0, 'lost', '269', 'pending', '2025-11-06 14:37:59', 61.00, 'L', '604536002'),
(37, 60, 4, 'Pakistan v South Africa', 325199885132, '10 over run SA', 'fancy', 50000.00, 0, 'lost', '269', 'pending', '2025-11-06 14:38:13', 60.00, 'L', '604536002'),
(38, 60, 4, 'Pakistan v South Africa', 325199885132, '35.3 over run SA', 'fancy', 5000.00, 0, 'lost', '269', 'pending', '2025-11-06 16:53:30', 242.00, 'L', '604536002'),
(39, 60, 4, 'Pakistan v South Africa', 325199885132, '35.3 over run SA', 'fancy', 5000.00, 0, 'lost', '269', 'pending', '2025-11-06 16:53:41', 241.00, 'K', '604536002'),
(40, 60, 4, 'WBBL', 198329358977, 'Highest Partnership Runs in WBBL', 'fancy', 100.00, 0, 'pending', 'bets saved successfully', 'pending', '2025-11-07 09:56:14', 135.00, 'K', '816538183'),
(41, 60, 4, 'WBBL', 198329358977, 'Highest Inning runs in WBBL (1st Inn)', 'fancy', 100.00, 0, 'pending', 'bets saved successfully', 'pending', '2025-11-07 10:38:49', 203.00, 'K', '816538183'),
(42, 60, 4, 'Haryana v Uttarakhand', 308410790216, 'Fall of 1st wkt HAR', 'fancy', 500.00, 0, 'lost', '48', 'pending', '2025-11-08 04:41:34', 53.00, 'K', '799361055'),
(43, 60, 4, 'Haryana v Uttarakhand', 308410790216, 'Fall of 3rd wkt UTK', 'fancy', 1000.00, 0, 'lost', '48', 'pending', '2025-11-08 19:25:19', 150.00, 'L', '799361055'),
(44, 60, 4, 'Haryana v Uttarakhand', 308410790216, '50 over run UTK', 'fancy', 500.00, 0, 'lost', '48', 'pending', '2025-11-08 19:25:27', 138.00, 'L', '799361055'),
(45, 60, 4, 'WBBL', 198329358977, 'Highest Inning runs in WBBL (1st Inn)', 'fancy', 500.00, 0, 'pending', 'bets saved successfully', 'pending', '2025-11-10 12:37:13', 209.00, 'L', '816538183'),
(46, 60, 4, 'WBBL', 198329358977, 'Most Duckout in an Inning of WBBL', 'fancy', 100.00, 0, 'pending', 'bets saved successfully', 'pending', '2025-11-10 12:37:49', 3.00, 'K', '816538183'),
(47, 60, 4, 'WBBL', 198329358977, 'Most Impact Overs in an Inning of WBBL', 'fancy', 500.00, 0, 'pending', 'bets saved successfully', 'pending', '2025-11-10 12:38:38', 11.00, 'K', '816538183'),
(48, 60, 4, 'WBBL', 198329358977, 'Most Duckout in an Inning of WBBL', 'fancy', 101.00, 0, 'pending', 'bets saved successfully', 'pending', '2025-11-10 12:48:05', 3.00, 'K', '816538183'),
(49, 60, 4, 'WBBL', 198329358977, 'Most Boundaries in an Inning of WBBL', 'fancy', 221.00, 0, 'pending', 'bets saved successfully', 'pending', '2025-11-10 13:00:30', 30.00, 'K', '816538183'),
(50, 60, 4, 'Tasmania Tigers v South Australia', 682092315710, '30 over run SA', 'fancy', 111.00, 0, 'lost', '106', 'pending', '2025-11-10 13:03:47', 105.00, 'K', '844065029'),
(51, 60, 4, 'Tasmania Tigers v South Australia', 682092315710, '30 over run SA', 'fancy', 5000.00, 0, 'lost', '106', 'pending', '2025-11-10 13:04:56', 107.00, 'L', '844065029'),
(52, 60, 4, 'Tasmania Tigers v South Australia', 682092315710, 'Fall of 4th wkt SA', 'fancy', 5000.00, 0, 'lost', '106', 'pending', '2025-11-10 13:05:05', 116.00, 'L', '844065029'),
(53, 60, 4, 'Tasmania Tigers v South Australia', 682092315710, '30 over run SA', 'fancy', 5000.00, 0, 'lost', '106', 'pending', '2025-11-10 13:05:22', 107.00, 'L', '844065029'),
(54, 60, 4, 'New South Wales Blues v Victoria', 866053512442, '1st Innings run VIC', 'fancy', 1000.00, 0, 'lost', '380', 'pending', '2025-11-10 13:05:54', 396.00, 'L', '649064242'),
(55, 60, 4, 'New South Wales Blues v Victoria', 866053512442, '1st Innings run VIC', 'fancy', 1000.00, 0, 'lost', '380', 'pending', '2025-11-10 17:43:47', 395.00, 'L', '649064242'),
(56, 60, 4, 'WBBL', 198329358977, 'Highest Inning runs in WBBL (1st Inn)', 'fancy', 500.00, 0, 'pending', 'bets saved successfully', 'pending', '2025-11-10 18:22:19', 209.00, 'L', '816538183'),
(57, 60, 4, 'WBBL', 198329358977, 'Total 50\'s in WBBL', 'fancy', 1000.00, 0, 'pending', 'bets saved successfully', 'pending', '2025-11-10 19:39:48', 44.00, 'K', '816538183'),
(58, 60, 4, 'WBBL', 198329358977, 'Total Runout in WBBL', 'fancy', 1000.00, 0, 'pending', 'bets saved successfully', 'pending', '2025-11-10 19:39:53', 45.00, 'K', '816538183'),
(59, 60, 4, 'WBBL', 198329358977, 'Highest 4s in Indvidual Match of WBBL', 'fancy', 1000.00, 0, 'pending', 'bets saved successfully', 'pending', '2025-11-10 19:39:58', 48.00, 'L', '816538183'),
(60, 60, 4, 'Tasmania Tigers v South Australia', 682092315710, 'C Jewell run 2', 'fancy', 100.00, 0, 'lost', '106', 'pending', '2025-11-11 04:02:10', 23.00, 'K', '844065029'),
(61, 60, 4, 'Bangladesh v Ireland', 487754674232, '20 over run IRE', 'fancy', 111.00, 0, 'lost', '74', 'pending', '2025-11-11 05:03:32', 76.00, 'K', '826879750'),
(62, 60, 4, 'Bangladesh v Ireland', 487754674232, 'C Carmichael boundaries', 'fancy', 101.00, 0, 'lost', '74', 'pending', '2025-11-11 05:03:51', 5.00, 'L', '826879750'),
(63, 60, 4, 'Bangladesh v Ireland', 6374801504431, 'Bangladesh', 'match', 100.00, 0, 'pending', 'bets saved successfully', 'pending', '2025-11-11 05:04:09', 1.37, 'L', '826879750'),
(64, 60, 4, 'Bangladesh v Ireland', 6374801504431, 'Bangladesh', 'match', 201.00, 0, 'pending', 'bets saved successfully', 'pending', '2025-11-11 05:04:29', 1.38, 'K', '826879750'),
(65, 60, 4, 'Bangladesh v Ireland', 6374801504431, 'Ireland', 'match', 221.00, 0, 'pending', 'bets saved successfully', 'pending', '2025-11-11 05:08:25', 4.80, 'K', '826879750'),
(66, 60, 4, 'Bangladesh v Ireland', 487754674232, '1st innings run IRE(BAN vs IRE)adv', 'fancy', 202.00, 0, 'lost', '74', 'pending', '2025-11-11 05:08:43', 302.00, 'L', '826879750'),
(67, 60, 4, 'Melbourne Renegades W v Sydney Thunder W', 571430702299, '10 over run MR W', 'fancy', 500.00, 0, 'lost', '71', 'pending', '2025-11-11 06:21:57', 66.00, 'L', '904125169'),
(68, 60, 4, 'Melbourne Renegades W v Sydney Thunder W', 7243698215911, 'Sydney Thunder W', 'match', 100.00, 0, 'lost', 'Melbourne Renegades W', 'pending', '2025-11-11 06:22:09', 1.70, 'L', '904125169'),
(69, 60, 4, 'Melbourne Renegades W v Sydney Thunder W', 7243698215911, 'Sydney Thunder W', 'match', 100.00, 0, 'lost', 'Melbourne Renegades W', 'pending', '2025-11-11 06:22:26', 1.87, 'K', '904125169'),
(70, 60, 4, 'Melbourne Renegades W v Sydney Thunder W', 7243698215911, 'Sydney Thunder W', 'match', 100.00, 0, 'lost', 'Melbourne Renegades W', 'pending', '2025-11-11 06:22:38', 1.86, 'L', '904125169'),
(71, 60, 4, 'Melbourne Renegades W v Sydney Thunder W', 7243698215911, 'Sydney Thunder W', 'match', 100.00, 0, 'lost', 'Melbourne Renegades W', 'pending', '2025-11-11 06:22:43', 1.87, 'K', '904125169'),
(72, 60, 4, 'Melbourne Renegades W v Sydney Thunder W', 571430702299, '10 over run MR W', 'fancy', 100.00, 0, 'lost', '71', 'pending', '2025-11-11 06:23:03', 69.00, 'L', '904125169'),
(73, 60, 4, 'Melbourne Renegades W v Sydney Thunder W', 7243698215911, 'Melbourne Renegades W', 'match', 100.00, 0, 'lost', 'Melbourne Renegades W', 'pending', '2025-11-11 06:23:32', 2.00, 'K', '904125169'),
(74, 60, 4, 'Melbourne Renegades W v Sydney Thunder W', 7243698215911, 'Melbourne Renegades W', 'match', 100.00, 0, 'lost', 'Melbourne Renegades W', 'pending', '2025-11-11 06:23:38', 1.98, 'L', '904125169'),
(75, 60, 4, 'Melbourne Renegades W v Sydney Thunder W', 571430702299, 'G Wareham run bhav', 'fancy', 100.00, 0, 'lost', '71', 'pending', '2025-11-11 06:23:46', 35.00, 'L', '904125169'),
(76, 60, 4, 'Melbourne Renegades W v Sydney Thunder W', 571430702299, '5th wkt pship boundaries MR W', 'fancy', 100.00, 0, 'lost', '71', 'pending', '2025-11-11 06:23:51', 5.00, 'K', '904125169'),
(77, 60, 4, 'Western Australia v Queensland', 705195513114, '55 over run QLD', 'fancy', 100.00, 0, 'lost', '177', 'pending', '2025-11-11 07:00:21', 169.00, 'L', '621870136'),
(78, 60, 4, 'Bangladesh v Ireland', 487754674232, '40 over run IRE', 'fancy', 500.00, 0, 'lost', '74', 'pending', '2025-11-11 07:01:47', 139.00, 'L', '826879750'),
(79, 60, 4, 'Bangladesh v Ireland', 487754674232, '39 over run IRE', 'fancy', 500.00, 0, 'lost', '74', 'pending', '2025-11-11 07:01:50', 136.00, 'L', '826879750'),
(80, 60, 4, 'Warriors v Lions', 619486973833, '6 over run bhav WAR', 'fancy', 1000.00, 0, 'lost', '42', 'pending', '2025-11-11 18:20:47', 43.00, 'K', '747777347'),
(81, 60, 4, 'Wellington Firebirds v Auckland Aces', 5212021874222, 'Auckland Aces', 'match1', 100.00, 0, 'lost', 'Auckland Aces', 'pending', '2025-11-12 05:01:03', 1.00, 'K', '619911585'),
(82, 60, 4, 'Wellington Firebirds v Auckland Aces', 5212021874222, 'Auckland Aces', 'match1', 101.00, 0, 'lost', 'Auckland Aces', 'pending', '2025-11-12 05:02:06', 1.00, 'K', '619911585'),
(83, 60, 4, 'Bangladesh v Ireland', 487754674232, 'M Hasan Joy 1st Inn Boundaries(BAN vs IRE)adv', 'fancy', 111.00, 0, 'lost', '74', 'pending', '2025-11-12 05:30:06', 13.00, 'K', '826879750'),
(84, 60, 4, 'Bangladesh v Ireland', 8640361419979, 'Bangladesh', 'match1', 100.00, 0, 'pending', 'bets saved successfully', 'pending', '2025-11-12 06:53:07', 6.50, 'K', '826879750'),
(85, 60, 4, 'Bangladesh v Ireland', 8640361419979, 'Bangladesh', 'match1', 121.00, 0, 'pending', 'bets saved successfully', 'pending', '2025-11-12 07:20:02', 4.00, 'L', '826879750'),
(86, 60, 4, 'Bangladesh v Ireland', 8640361419979, 'Bangladesh', 'match1', 11.00, 0, 'pending', 'bets saved successfully', 'pending', '2025-11-12 07:22:35', 4.50, 'K', '826879750'),
(87, 60, 4, 'Bangladesh v Ireland', 8640361419979, 'Bangladesh', 'match1', 100.00, 0, 'pending', 'bets saved successfully', 'pending', '2025-11-12 08:45:21', 4.00, 'L', '826879750'),
(88, 60, 4, 'Bangladesh v Ireland', 8640361419979, 'Bangladesh', 'match1', 500.00, 0, 'pending', 'bets saved successfully', 'pending', '2025-11-12 08:46:29', 4.00, 'L', '826879750'),
(89, 110, 4, 'Western Australia v Queensland', 705195513114, '60 over run WA', 'fancy', 500.00, 0, 'lost', '177', 'pending', '2025-11-12 08:54:21', 178.00, 'K', '621870136'),
(90, 110, 4, 'Bangladesh v Ireland', 8640361419979, 'Bangladesh', 'match1', 1000.00, 0, 'pending', 'bets saved successfully', 'pending', '2025-11-12 08:55:25', 5.00, 'K', '826879750'),
(91, 60, 4, 'WBBL', 198329358977, 'Highest Inning runs in WBBL (1st Inn)', 'fancy', 100.00, 0, 'pending', 'bets saved successfully', 'pending', '2025-11-12 16:10:27', 208.00, 'L', '816538183');

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
(1, 60, 100.00, 'Bet placed on teen (Match ID: 101251107122226)', 'DR', 30403.00, 30303.00, 'success', 0, '2025-11-07 06:54:56'),
(2, 60, 500.00, 'Bet placed on teen (Match ID: 101251107122621)', 'DR', 30303.00, 29803.00, 'success', 0, '2025-11-07 06:59:02'),
(3, 60, 100.00, 'Bet placed on teen (Match ID: 101251107122621)', 'DR', 29803.00, 29703.00, 'success', 0, '2025-11-07 06:59:28'),
(4, 60, 100.00, 'Bet placed on lucky7eu (Match ID: 107251107123451)', 'DR', 29833.00, 29733.00, 'success', 0, '2025-11-07 07:05:17'),
(5, 60, 1000.00, 'Bet placed on lucky7eu (Match ID: 107251107123816)', 'DR', 29933.00, 28933.00, 'success', 0, '2025-11-07 07:08:23'),
(6, 60, 500.00, 'Bet placed on lucky7eu (Match ID: 107251107124226)', 'DR', 30933.00, 30433.00, 'success', 0, '2025-11-07 07:12:52'),
(7, 60, 1000.00, 'Bet placed on lucky7eu (Match ID: 107251107124346)', 'DR', 31433.00, 30433.00, 'success', 0, '2025-11-07 07:13:55'),
(8, 60, 1000.00, 'Bet placed on lucky7eu (Match ID: 107251107124543)', 'DR', 30433.00, 29433.00, 'success', 0, '2025-11-07 07:15:51'),
(9, 60, 500.00, 'Bet placed on lucky7eu (Match ID: 107251107125358)', 'DR', 31433.00, 30933.00, 'success', 0, '2025-11-07 07:24:04'),
(10, 60, 500.00, 'Bet placed on lucky7eu (Match ID: 107251107125603)', 'DR', 30933.00, 30433.00, 'success', 0, '2025-11-07 07:26:27'),
(11, 60, 100.00, 'Bet placed on lucky7eu (Match ID: 107251107125644)', 'DR', 30433.00, 30333.00, 'success', 0, '2025-11-07 07:27:01'),
(12, 60, 500.00, 'Bet placed on lucky7eu (Match ID: 107251107125725)', 'DR', 30333.00, 29833.00, 'success', 0, '2025-11-07 07:27:31'),
(13, 60, 1000.00, 'Bet placed on teen (Match ID: 101251107135804)', 'DR', 30833.00, 29833.00, 'success', 0, '2025-11-07 08:30:15'),
(14, 60, 500.00, 'Bet placed on aaa (Match ID: 121251107151641)', 'DR', 31793.00, 31293.00, 'success', 0, '2025-11-07 09:54:01'),
(15, 60, 100.00, 'Bet placed on aaa (Match ID: 121251107151641)', 'DR', 31293.00, 31193.00, 'success', 0, '2025-11-07 09:54:32'),
(16, 60, 100.00, 'Bet placed on WBBL', 'DR', 31193.00, 31093.00, 'success', 0, '2025-11-07 09:56:14'),
(17, 60, 100.00, 'Bet placed on WBBL', 'DR', 31093.00, 30993.00, 'success', 0, '2025-11-07 10:38:49'),
(18, 60, 500.00, 'Bet placed on teen20 (Match ID: 102251107163308)', 'DR', 30993.00, 30493.00, 'success', 0, '2025-11-07 11:03:15'),
(19, 60, 990.00, 'Winnings from teen20 (Match ID: 102251107163308)', 'CR', 30493.00, 31483.00, 'success', 0, '2025-11-07 11:05:01'),
(20, 60, 500.00, 'Bet placed on teen (Match ID: 101251107163455)', 'DR', 31483.00, 30983.00, 'success', 0, '2025-11-07 11:05:03'),
(21, 60, 211.00, 'Bet placed on teen20 (Match ID: 102251107163512)', 'DR', 30983.00, 30772.00, 'success', 0, '2025-11-07 11:05:33'),
(22, 60, 101.00, 'Bet placed on dt20 (Match ID: 116251107163551)', 'DR', 30772.00, 30671.00, 'success', 0, '2025-11-07 11:06:09'),
(23, 60, 121.00, 'Bet placed on dt202 (Match ID: 117251107163626)', 'DR', 30671.00, 30550.00, 'success', 0, '2025-11-07 11:06:34'),
(24, 60, 201.00, 'Bet placed on dt202 (Match ID: 117251107163900)', 'DR', 30550.00, 30349.00, 'success', 0, '2025-11-07 11:09:09'),
(25, 60, 222.00, 'Bet placed on card32 (Match ID: 113251107164214)', 'DR', 30349.00, 30127.00, 'success', 0, '2025-11-07 11:12:22'),
(26, 60, 1224.00, 'Bet placed on lucky7eu (Match ID: 107251107164227)', 'DR', 30127.00, 28903.00, 'success', 0, '2025-11-07 11:12:35'),
(27, 60, 111.00, 'Bet placed on aaa (Match ID: 121251107164238)', 'DR', 28903.00, 28792.00, 'success', 0, '2025-11-07 11:12:49'),
(28, 60, 461.76, 'Winnings from card32 (Match ID: 113251107164214)', 'CR', 28792.00, 29253.76, 'success', 0, '2025-11-07 11:14:02'),
(29, 60, 100.00, 'Bet placed on teen (Match ID: 101251107172008)', 'DR', 29253.76, 29153.76, 'success', 0, '2025-11-07 11:50:17'),
(30, 60, 198.00, 'Winnings from teen (Match ID: 101251107172008)', 'CR', 29153.76, 29351.76, 'success', 0, '2025-11-07 11:54:01'),
(31, 60, 500.00, 'Bet placed on Haryana v Uttarakhand', 'DR', 29351.76, 28851.76, 'success', 0, '2025-11-08 04:41:34'),
(32, 60, 1000.00, 'Bet placed on teen (Match ID: 101251108101007)', 'DR', 28851.76, 27851.76, 'success', 0, '2025-11-08 04:42:30'),
(33, 60, 1000.00, 'Bet placed on aaa (Match ID: 121251108101800)', 'DR', 27851.76, 26851.76, 'success', 0, '2025-11-08 04:48:06'),
(34, 60, 2120.00, 'Winnings from aaa (Match ID: 121251108101800)', 'CR', 26851.76, 28971.76, 'success', 0, '2025-11-08 04:49:02'),
(35, 93, 100000.00, 'Amount Deposited (from master)', 'CR', 0.00, 100000.00, 'success', 1, '2025-11-08 13:43:22'),
(36, 93, 100000.00, 'Amount Deposited (from master)', 'CR', 0.00, 100000.00, 'success', 1, '2025-11-08 13:43:22'),
(37, 93, 100000.00, 'Amount Deposited (from master)', 'CR', 100000.00, 200000.00, 'success', 1, '2025-11-08 13:43:22'),
(38, 93, 100000.00, 'Amount Deposited (from master)', 'CR', 100000.00, 200000.00, 'success', 1, '2025-11-08 13:43:22'),
(39, 93, 100000.00, 'Amount Deposited (from master)', 'CR', 200000.00, 300000.00, 'success', 1, '2025-11-08 13:43:48'),
(40, 60, 500.00, 'Bet placed on teen (Match ID: 101251109005353)', 'DR', 28971.76, 28471.76, 'success', 0, '2025-11-08 19:24:51'),
(41, 60, 1000.00, 'Bet placed on Haryana v Uttarakhand', 'DR', 28471.76, 27471.76, 'success', 0, '2025-11-08 19:25:19'),
(42, 60, 500.00, 'Bet placed on Haryana v Uttarakhand', 'DR', 27471.76, 26971.76, 'success', 0, '2025-11-08 19:25:27'),
(43, 60, 500.00, 'Bet placed on WBBL', 'DR', 26971.76, 26471.76, 'success', 0, '2025-11-10 12:37:13'),
(44, 60, 100.00, 'Bet placed on WBBL', 'DR', 26471.76, 26371.76, 'success', 0, '2025-11-10 12:37:49'),
(45, 60, 500.00, 'Bet placed on WBBL', 'DR', 26371.76, 25871.76, 'success', 0, '2025-11-10 12:38:38'),
(46, 60, 101.00, 'Bet placed on WBBL', 'DR', 25871.76, 25770.76, 'success', 0, '2025-11-10 12:48:05'),
(47, 60, 221.00, 'Bet placed on WBBL', 'DR', 25770.76, 25549.76, 'success', 0, '2025-11-10 13:00:30'),
(48, 60, 111.00, 'Bet placed on Tasmania Tigers v South Australia', 'DR', 25549.76, 25438.76, 'success', 0, '2025-11-10 13:03:47'),
(49, 60, 5000.00, 'Bet placed on Tasmania Tigers v South Australia', 'DR', 25438.76, 20438.76, 'success', 0, '2025-11-10 13:04:56'),
(50, 60, 5000.00, 'Bet placed on Tasmania Tigers v South Australia', 'DR', 20438.76, 15438.76, 'success', 0, '2025-11-10 13:05:05'),
(51, 60, 5000.00, 'Bet placed on Tasmania Tigers v South Australia', 'DR', 15438.76, 10438.76, 'success', 0, '2025-11-10 13:05:22'),
(52, 60, 1000.00, 'Bet placed on New South Wales Blues v Victoria', 'DR', 10438.76, 9438.76, 'success', 0, '2025-11-10 13:05:54'),
(53, 60, 100.00, 'Bet placed on teen (Match ID: 101251110185401)', 'DR', 9438.76, 9338.76, 'success', 0, '2025-11-10 13:28:45'),
(54, 60, 144.00, 'Winnings from teen (Match ID: 101251110185401)', 'CR', 9338.76, 9482.76, 'success', 0, '2025-11-10 13:30:02'),
(55, 60, 1000.00, 'Bet placed on New South Wales Blues v Victoria', 'DR', 9482.76, 8482.76, 'success', 0, '2025-11-10 17:43:47'),
(56, 60, 500.00, 'Bet placed on WBBL', 'DR', 8482.76, 7982.76, 'success', 0, '2025-11-10 18:22:19'),
(57, 60, 100.00, 'Bet placed on lucky7eu (Match ID: 107251110235236)', 'DR', 7982.76, 7882.76, 'success', 0, '2025-11-10 18:22:47'),
(58, 60, 200.00, 'Winnings from lucky7eu (Match ID: 107251110235236)', 'CR', 7882.76, 8082.76, 'success', 0, '2025-11-10 18:24:02'),
(59, 60, 1000.00, 'Bet placed on WBBL', 'DR', 8082.76, 7082.76, 'success', 0, '2025-11-10 19:39:48'),
(60, 60, 1000.00, 'Bet placed on WBBL', 'DR', 7082.76, 6082.76, 'success', 0, '2025-11-10 19:39:53'),
(61, 60, 1000.00, 'Bet placed on WBBL', 'DR', 6082.76, 5082.76, 'success', 0, '2025-11-10 19:39:58'),
(62, 60, 100.00, 'Bet placed on Tasmania Tigers v South Australia', 'DR', 5082.76, 4982.76, 'success', 0, '2025-11-11 04:02:10'),
(63, 60, 111.00, 'Bet placed on Bangladesh v Ireland', 'DR', 4982.76, 4871.76, 'success', 0, '2025-11-11 05:03:32'),
(64, 60, 101.00, 'Bet placed on Bangladesh v Ireland', 'DR', 4871.76, 4770.76, 'success', 0, '2025-11-11 05:03:51'),
(65, 60, 100.00, 'Bet placed on Bangladesh v Ireland', 'DR', 4770.76, 4670.76, 'success', 0, '2025-11-11 05:04:09'),
(66, 60, 201.00, 'Bet placed on Bangladesh v Ireland', 'DR', 4670.76, 4469.76, 'success', 0, '2025-11-11 05:04:29'),
(67, 60, 221.00, 'Bet placed on Bangladesh v Ireland', 'DR', 4469.76, 4248.76, 'success', 0, '2025-11-11 05:08:25'),
(68, 60, 202.00, 'Bet placed on Bangladesh v Ireland', 'DR', 4248.76, 4046.76, 'success', 0, '2025-11-11 05:08:43'),
(69, 60, 500.00, 'Bet placed on Melbourne Renegades W v Sydney Thunder W', 'DR', 4046.76, 3546.76, 'success', 0, '2025-11-11 06:21:57'),
(70, 60, 100.00, 'Bet placed on Melbourne Renegades W v Sydney Thunder W', 'DR', 3546.76, 3446.76, 'success', 0, '2025-11-11 06:22:09'),
(71, 60, 100.00, 'Bet placed on Melbourne Renegades W v Sydney Thunder W', 'DR', 3446.76, 3346.76, 'success', 0, '2025-11-11 06:22:26'),
(72, 60, 100.00, 'Bet placed on Melbourne Renegades W v Sydney Thunder W', 'DR', 3346.76, 3246.76, 'success', 0, '2025-11-11 06:22:38'),
(73, 60, 100.00, 'Bet placed on Melbourne Renegades W v Sydney Thunder W', 'DR', 3246.76, 3146.76, 'success', 0, '2025-11-11 06:22:43'),
(74, 60, 100.00, 'Bet placed on Melbourne Renegades W v Sydney Thunder W', 'DR', 3146.76, 3046.76, 'success', 0, '2025-11-11 06:23:03'),
(75, 60, 100.00, 'Bet placed on Melbourne Renegades W v Sydney Thunder W', 'DR', 3046.76, 2946.76, 'success', 0, '2025-11-11 06:23:32'),
(76, 60, 100.00, 'Bet placed on Melbourne Renegades W v Sydney Thunder W', 'DR', 2946.76, 2846.76, 'success', 0, '2025-11-11 06:23:38'),
(77, 60, 100.00, 'Bet placed on Melbourne Renegades W v Sydney Thunder W', 'DR', 2846.76, 2746.76, 'success', 0, '2025-11-11 06:23:46'),
(78, 60, 100.00, 'Bet placed on Melbourne Renegades W v Sydney Thunder W', 'DR', 2746.76, 2646.76, 'success', 0, '2025-11-11 06:23:51'),
(79, 60, 100.00, 'Bet placed on Western Australia v Queensland', 'DR', 2646.76, 2546.76, 'success', 0, '2025-11-11 07:00:21'),
(80, 60, 500.00, 'Bet placed on Bangladesh v Ireland', 'DR', 2546.76, 2046.76, 'success', 0, '2025-11-11 07:01:47'),
(81, 60, 500.00, 'Bet placed on Bangladesh v Ireland', 'DR', 2046.76, 1546.76, 'success', 0, '2025-11-11 07:01:50'),
(82, 103, 100000.00, 'Amount Deposited (from master)', 'CR', 500000.00, 600000.00, 'success', 1, '2025-11-11 09:54:44'),
(83, 1, 100000.00, 'Amount Deducted for user deposit', 'DR', 98000000.00, 97900000.00, 'success', 1, '2025-11-11 09:54:44'),
(84, 60, 1000.00, 'Bet placed on Warriors v Lions', 'DR', 1546.76, 546.76, 'success', 0, '2025-11-11 18:20:47'),
(85, 60, 100.00, 'Bet placed on Wellington Firebirds v Auckland Aces', 'DR', 546.76, 446.76, 'success', 0, '2025-11-12 05:01:03'),
(86, 60, 101.00, 'Bet placed on Wellington Firebirds v Auckland Aces', 'DR', 446.76, 345.76, 'success', 0, '2025-11-12 05:02:06'),
(87, 60, 111.00, 'Bet placed on Bangladesh v Ireland', 'DR', 345.76, 234.76, 'success', 0, '2025-11-12 05:30:06'),
(88, 60, 100.00, 'Bet placed on Bangladesh v Ireland', 'DR', 234.76, 134.76, 'success', 0, '2025-11-12 06:53:07'),
(89, 60, 121.00, 'Bet placed on Bangladesh v Ireland', 'DR', 134.76, 13.76, 'success', 0, '2025-11-12 07:20:02'),
(90, 60, 11.00, 'Bet placed on Bangladesh v Ireland', 'DR', 13.76, 2.76, 'success', 0, '2025-11-12 07:22:35'),
(91, 108, 1.00, 'Amount Deposited (from master)', 'CR', 5000.00, 5001.00, 'success', 1, '2025-11-12 08:34:39'),
(92, 107, 1.00, 'Amount Deducted for user deposit', 'DR', 5000.00, 4999.00, 'success', 1, '2025-11-12 08:34:39'),
(93, 108, 5001.00, 'Amount Withdrawn (to master)', 'DR', 5001.00, 0.00, 'success', 1, '2025-11-12 08:40:59'),
(94, 107, 5001.00, 'Amount Credited for user withdrawal', 'CR', 4999.00, 10000.00, 'success', 1, '2025-11-12 08:40:59'),
(95, 60, 100.00, 'Bet placed on Bangladesh v Ireland', 'DR', 2000.00, 1900.00, 'success', 0, '2025-11-12 08:45:21'),
(96, 60, 500.00, 'Bet placed on Bangladesh v Ireland', 'DR', 1900.00, 1400.00, 'success', 0, '2025-11-12 08:46:29'),
(97, 110, 5000.00, 'Initial amount assigned by master', 'CR', 0.00, 5000.00, 'success', 1, '2025-11-12 08:52:34'),
(98, 107, 5000.00, 'Amount assigned to new admin', 'DR', 10000.00, 5000.00, 'success', 1, '2025-11-12 08:52:34'),
(99, 110, 500.00, 'Bet placed on Western Australia v Queensland', 'DR', 5000.00, 4500.00, 'success', 0, '2025-11-12 08:54:21'),
(100, 110, 1000.00, 'Bet placed on Bangladesh v Ireland', 'DR', 4500.00, 3500.00, 'success', 0, '2025-11-12 08:55:25'),
(101, 110, 200.00, 'Bet placed on dt20 (Match ID: 116251112143314)', 'DR', 3500.00, 3300.00, 'success', 0, '2025-11-12 09:03:21'),
(102, 110, 100.00, 'Bet placed on lucky7eu (Match ID: 107251112145902)', 'DR', 3300.00, 3200.00, 'success', 0, '2025-11-12 09:29:22'),
(103, 110, 100.00, 'Bet placed on lucky7eu (Match ID: 107251112150155)', 'DR', 3200.00, 3100.00, 'success', 0, '2025-11-12 09:32:18'),
(104, 110, 200.00, 'Winnings from lucky7eu (Match ID: 107251112150155)', 'CR', 3100.00, 3300.00, 'success', 0, '2025-11-12 09:33:02'),
(105, 110, 100.00, 'Bet placed on aaa (Match ID: 121251112151525)', 'DR', 3300.00, 3200.00, 'success', 0, '2025-11-12 09:45:54'),
(106, 110, 100.00, 'Bet placed on aaa (Match ID: 121251112151525)', 'DR', 3200.00, 3100.00, 'success', 0, '2025-11-12 09:45:59'),
(107, 110, 212.00, 'Winnings from aaa (Match ID: 121251112151525)', 'CR', 3100.00, 3312.00, 'success', 0, '2025-11-12 09:47:02'),
(108, 60, 1000.00, 'Bet placed on teen (Match ID: 101251112213700)', 'DR', 1400.00, 400.00, 'success', 0, '2025-11-12 16:09:45'),
(109, 60, 100.00, 'Bet placed on WBBL', 'DR', 400.00, 300.00, 'success', 0, '2025-11-12 16:10:27'),
(110, 60, 100.00, 'Bet placed on teen (Match ID: 101251112214055)', 'DR', 300.00, 200.00, 'success', 0, '2025-11-12 16:14:27'),
(111, 60, 115.00, 'Winnings from teen (Match ID: 101251112214055)', 'CR', 200.00, 315.00, 'success', 0, '2025-11-12 16:15:01'),
(112, 111, 10000000.00, 'Initial amount assigned by master', 'CR', 0.00, 10000000.00, 'success', 1, '2025-11-12 16:17:03'),
(113, 1, 10000000.00, 'Amount assigned to new admin', 'DR', 97900000.00, 87900000.00, 'success', 1, '2025-11-12 16:17:03'),
(114, 112, 10000000.00, 'Initial amount assigned by master', 'CR', 0.00, 10000000.00, 'success', 1, '2025-11-12 16:19:46'),
(115, 111, 10000000.00, 'Amount assigned to new admin', 'DR', 10000000.00, 0.00, 'success', 1, '2025-11-12 16:19:46'),
(116, 113, 1000000.00, 'Initial amount assigned by master', 'CR', 0.00, 1000000.00, 'success', 1, '2025-11-12 16:21:12'),
(117, 112, 1000000.00, 'Amount assigned to new admin', 'DR', 10000000.00, 9000000.00, 'success', 1, '2025-11-12 16:21:12'),
(118, 114, 1000000.00, 'Initial amount assigned by master', 'CR', 0.00, 1000000.00, 'success', 1, '2025-11-12 16:22:11'),
(119, 113, 1000000.00, 'Amount assigned to new admin', 'DR', 1000000.00, 0.00, 'success', 1, '2025-11-12 16:22:11'),
(120, 115, 1000000.00, 'Initial amount assigned by master', 'CR', 0.00, 1000000.00, 'success', 1, '2025-11-12 16:22:45'),
(121, 114, 1000000.00, 'Amount assigned to new admin', 'DR', 1000000.00, 0.00, 'success', 1, '2025-11-12 16:22:45'),
(122, 116, 1000000.00, 'Initial amount assigned by master', 'CR', 0.00, 1000000.00, 'success', 1, '2025-11-12 16:23:10'),
(123, 115, 1000000.00, 'Amount assigned to new admin', 'DR', 1000000.00, 0.00, 'success', 1, '2025-11-12 16:23:10'),
(124, 117, 5000.00, 'Initial amount assigned by master', 'CR', 0.00, 5000.00, 'success', 1, '2025-11-12 16:24:45'),
(125, 109, 5000.00, 'Amount assigned to new admin', 'DR', 5000.00, 0.00, 'success', 1, '2025-11-12 16:24:45'),
(126, 60, 100.00, 'Bet placed on teen (Match ID: 101251112223743)', 'DR', 315.00, 215.00, 'success', 0, '2025-11-12 17:09:57'),
(127, 118, 87900000.00, 'Initial amount assigned by master', 'CR', 0.00, 87900000.00, 'success', 1, '2025-11-12 17:16:08'),
(128, 1, 87900000.00, 'Amount assigned to new admin', 'DR', 87900000.00, 0.00, 'success', 1, '2025-11-12 17:16:08');

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
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `image`, `username`, `mobile`, `email`, `password`, `wallet`, `dob`, `gender`, `role`, `token`, `master_user`, `self_amount_limit`, `self_share`, `Match_comission`, `cassino_comission`, `session_comission`, `status`, `created_at`, `updated_at`) VALUES
(1, 'company', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'company', NULL, NULL, '1234', 0.00, NULL, NULL, 1, 'b298a32e524dbbd058d98d60', NULL, 0.00, 0.00, 0.00, 0.00, 0.00, 1, '2025-10-09 09:53:42', '2025-11-12 17:16:08'),
(60, 'Client', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'clientl', NULL, NULL, '1234', 0.00, NULL, NULL, 7, '3080a0632f7d20ceba57b', 'BK2507', 1000000.00, 0.00, 5.00, 5.00, 5.00, 1, '2025-11-05 06:56:34', '2025-11-05 06:57:12'),
(101, 'check 1', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'RA8437', NULL, NULL, '1234', 0.00, NULL, NULL, 2, NULL, 'company', 900000.00, 90.00, 10.00, 10.00, 10.00, 1, '2025-11-11 08:32:33', '2025-11-11 08:56:48'),
(102, 'checkadmin 1', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'SM1832', NULL, NULL, '1234', 0.00, NULL, NULL, 3, NULL, 'RA8437', 50000.00, 80.00, 9.00, 9.00, 9.00, 1, '2025-11-11 08:56:48', '2025-11-11 13:28:01'),
(103, 'super admin check 2', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'QU8262', NULL, NULL, '1234', 0.00, NULL, NULL, 2, NULL, 'company', 600000.00, 90.00, 10.00, 10.00, 10.00, 1, '2025-11-11 09:03:09', '2025-11-11 09:06:07'),
(104, 'check 2 adminmaster', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'IE4767', NULL, NULL, '1234', 0.00, NULL, NULL, 3, NULL, 'QU8262', 500000.00, 70.00, 7.00, 8.00, 9.00, 1, '2025-11-11 09:06:07', '2025-11-11 09:06:07'),
(105, 'sub admin master 1', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'NC3364', NULL, NULL, '1234', 0.00, NULL, NULL, 4, NULL, 'SM1832', 30000.00, 70.00, 7.00, 7.00, 7.00, 1, '2025-11-11 13:28:01', '2025-11-11 18:32:28'),
(106, 'supa 1', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'VW2443', NULL, NULL, '1234', 0.00, NULL, NULL, 5, NULL, 'NC3364', 5000.00, 60.00, 5.00, 6.00, 6.00, 1, '2025-11-11 18:32:02', '2025-11-12 04:11:29'),
(107, 'agent master 1', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'CI6023', NULL, NULL, '1234', 0.00, NULL, NULL, 6, NULL, 'VW2443', 5000.00, 50.00, 4.00, 4.00, 4.00, 1, '2025-11-11 18:33:18', '2025-11-12 08:52:34'),
(108, 'client 1', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'client', NULL, NULL, '1234', 0.00, NULL, NULL, 7, '245f844b9a1effc9b8e5926', 'CI6023', 0.00, 0.00, 3.00, 3.00, 3.00, 1, '2025-11-12 04:10:55', '2025-11-12 04:10:55'),
(109, 'agent 2', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'PM5053', NULL, NULL, '1234', 0.00, NULL, NULL, 6, NULL, 'VW2443', 0.00, 40.00, 4.00, 5.00, 5.00, 1, '2025-11-12 04:11:29', '2025-11-12 16:24:45'),
(110, 'client1', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'EG5129', NULL, NULL, '1234', 0.00, NULL, NULL, 7, '5a619f06065ca220f3ed', 'CI6023', 3312.00, 0.00, 3.00, 3.00, 3.00, 1, '2025-11-12 08:52:34', '2025-11-12 08:52:34'),
(111, 'Company 2', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'RD2772', NULL, NULL, '12355', 0.00, NULL, NULL, 2, NULL, 'company', 0.00, 95.00, 2.00, 2.00, 3.00, 1, '2025-11-12 16:17:03', '2025-11-12 16:19:46'),
(112, 'Company 2', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'HQ6052', NULL, NULL, '1234', 0.00, NULL, NULL, 3, NULL, 'RD2772', 9000000.00, 90.00, 2.00, 2.00, 3.00, 1, '2025-11-12 16:19:46', '2025-11-12 16:21:12'),
(113, 'Company 2', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'EL8063', NULL, NULL, '1234', 0.00, NULL, NULL, 4, NULL, 'HQ6052', 0.00, 85.00, 2.00, 2.00, 3.00, 1, '2025-11-12 16:21:12', '2025-11-12 16:22:11'),
(114, 'Company 2', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'QI3475', NULL, NULL, '1234', 0.00, NULL, NULL, 5, NULL, 'EL8063', 0.00, 80.00, 2.00, 2.00, 3.00, 1, '2025-11-12 16:22:11', '2025-11-12 16:22:45'),
(115, 'Company 2', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'RD9525', NULL, NULL, '1234', 0.00, NULL, NULL, 6, NULL, 'QI3475', 0.00, 75.00, 2.00, 2.00, 3.00, 1, '2025-11-12 16:22:45', '2025-11-12 16:23:10'),
(116, 'Company 2', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'FU9152', NULL, NULL, '1234', 0.00, NULL, NULL, 7, '012cca9315b72422d4031b448', 'RD9525', 1000000.00, 0.00, 2.00, 2.00, 3.00, 1, '2025-11-12 16:23:10', '2025-11-12 16:23:10'),
(117, 'Cl2580', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'QN5419', NULL, NULL, '1234', 0.00, NULL, NULL, 7, NULL, 'PM5053', 5000.00, 0.00, 4.00, 5.00, 2.00, 1, '2025-11-12 16:24:45', '2025-11-12 16:24:45'),
(118, 'Company 3', 'https://admin.stream4video.com/photo/profile_img/default_img.png', 'QY8276', NULL, NULL, '1234', 0.00, NULL, NULL, 2, NULL, 'company', 87900000.00, 95.00, 2.00, 2.00, 3.00, 1, '2025-11-12 17:16:08', '2025-11-12 17:16:08');

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
-- Indexes for table `sport_bets`
--
ALTER TABLE `sport_bets`
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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `rules`
--
ALTER TABLE `rules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sport_bets`
--
ALTER TABLE `sport_bets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- AUTO_INCREMENT for table `tbl_user_transaction`
--
ALTER TABLE `tbl_user_transaction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=129;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
