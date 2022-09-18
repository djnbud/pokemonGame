//how much needed to next level
const experienceLevelGrid = {
    1: { erratic: 15, fast: 6, mediumFast: 8, mediumSlow: 9, slow: 10, fluctuating: 4 },
    2: { erratic: 37, fast: 15, mediumFast: 19, mediumSlow: 48, slow: 23, fluctuating: 9 },
    3: { erratic: 70, fast: 30, mediumFast: 37, mediumSlow: 39, slow: 47, fluctuating: 19 },
    4: { erratic: 115, fast: 49, mediumFast: 61, mediumSlow: 39, slow: 76, fluctuating: 33 },
    5: { erratic: 169, fast: 72, mediumFast: 91, mediumSlow: 44, slow: 114, fluctuating: 47 },
    6: { erratic: 231, fast: 102, mediumFast: 127, mediumSlow: 57, slow: 158, fluctuating: 66 },
    7: { erratic: 305, fast: 135, mediumFast: 169, mediumSlow: 78, slow: 212, fluctuating: 98 },
    8: { erratic: 384, fast: 174, mediumFast: 217, mediumSlow: 105, slow: 271, fluctuating: 117 },
    9: { erratic: 474, fast: 217, mediumFast: 271, mediumSlow: 141, slow: 339, fluctuating: 147 },
    10: { erratic: 569, fast: 264, mediumFast: 331, mediumSlow: 182, slow: 413, fluctuating: 205 },
    11: { erratic: 672, fast: 318, mediumFast: 397, mediumSlow: 231, slow: 497, fluctuating: 222 },
    12: { erratic: 781, fast: 375, mediumFast: 469, mediumSlow: 288, slow: 586, fluctuating: 263 },
    13: { erratic: 897, fast: 438, mediumFast: 547, mediumSlow: 351, slow: 684, fluctuating: 361 },
    14: { erratic: 1018, fast: 505, mediumFast: 631, mediumSlow: 423, slow: 788, fluctuating: 366 },
    15: { erratic: 1144, fast: 576, mediumFast: 721, mediumSlow: 500, slow: 902, fluctuating: 500 },
    16: { erratic: 1274, fast: 654, mediumFast: 817, mediumSlow: 585, slow: 1021, fluctuating: 589 },
    17: { erratic: 1409, fast: 735, mediumFast: 919, mediumSlow: 678, slow: 1149, fluctuating: 686 },
    18: { erratic: 1547, fast: 822, mediumFast: 1027, mediumSlow: 777, slow: 1283, fluctuating: 794 },
    19: { erratic: 1689, fast: 913, mediumFast: 1141, mediumSlow: 885, slow: 1427, fluctuating: 914 },
    20: { erratic: 1832, fast: 1008, mediumFast: 1261, mediumSlow: 998, slow: 1576, fluctuating: 1042 },
    21: { erratic: 1978, fast: 1110, mediumFast: 1387, mediumSlow: 1119, slow: 1734, fluctuating: 1184 },
    22: { erratic: 2127, fast: 1215, mediumFast: 1519, mediumSlow: 1248, slow: 1898, fluctuating: 1337 },
    23: { erratic: 2275, fast: 1326, mediumFast: 1657, mediumSlow: 1383, slow: 2072, fluctuating: 1503 },
    24: { erratic: 2425, fast: 1441, mediumFast: 1801, mediumSlow: 1527, slow: 2251, fluctuating: 1681 },
    25: { erratic: 2575, fast: 1560, mediumFast: 1951, mediumSlow: 1676, slow: 2439, fluctuating: 1873 },
    26: { erratic: 2725, fast: 1686, mediumFast: 2107, mediumSlow: 1833, slow: 2633, fluctuating: 2080 },
    27: { erratic: 2873, fast: 1815, mediumFast: 2269, mediumSlow: 1998, slow: 2837, fluctuating: 2299 },
    28: { erratic: 3022, fast: 1950, mediumFast: 2437, mediumSlow: 2169, slow: 3046, fluctuating: 2535 },
    29: { erratic: 3168, fast: 2089, mediumFast: 2611, mediumSlow: 2349, slow: 3264, fluctuating: 2786 },
    30: { erratic: 3311, fast: 2232, mediumFast: 2791, mediumSlow: 2534, slow: 3488, fluctuating: 3051 },
    31: { erratic: 3453, fast: 2382, mediumFast: 2977, mediumSlow: 2727, slow: 3722, fluctuating: 3335 },
    32: { erratic: 3591, fast: 2535, mediumFast: 3169, mediumSlow: 2928, slow: 3961, fluctuating: 3634 },
    33: { erratic: 3726, fast: 2694, mediumFast: 3367, mediumSlow: 3135, slow: 4209, fluctuating: 3951 },
    34: { erratic: 3856, fast: 2857, mediumFast: 3571, mediumSlow: 3351, slow: 4463, fluctuating: 4286 },
    35: { erratic: 3982, fast: 3024, mediumFast: 3781, mediumSlow: 3572, slow: 4727, fluctuating: 4639 },
    36: { erratic: 4103, fast: 3198, mediumFast: 3997, mediumSlow: 3801, slow: 4996, fluctuating: 3997 },
    37: { erratic: 4219, fast: 3375, mediumFast: 4219, mediumSlow: 4038, slow: 5274, fluctuating: 5316 },
    38: { erratic: 4328, fast: 3558, mediumFast: 4447, mediumSlow: 4281, slow: 5558, fluctuating: 4536 },
    39: { erratic: 4431, fast: 3745, mediumFast: 4681, mediumSlow: 4533, slow: 5852, fluctuating: 6055 },
    40: { erratic: 4526, fast: 3936, mediumFast: 4921, mediumSlow: 4790, slow: 6151, fluctuating: 5117 },
    41: { erratic: 4616, fast: 4134, mediumFast: 5167, mediumSlow: 5055, slow: 6459, fluctuating: 6856 },
    42: { erratic: 4695, fast: 4335, mediumFast: 5419, mediumSlow: 5328, slow: 6773, fluctuating: 5744 },
    43: { erratic: 4769, fast: 4542, mediumFast: 5677, mediumSlow: 5607, slow: 7097, fluctuating: 7721 },
    44: { erratic: 4831, fast: 4753, mediumFast: 5941, mediumSlow: 5895, slow: 7426, fluctuating: 6417 },
    45: { erratic: 4885, fast: 4968, mediumFast: 6211, mediumSlow: 6188, slow: 7764, fluctuating: 8654 },
    46: { erratic: 4930, fast: 5190, mediumFast: 6487, mediumSlow: 6489, slow: 8108, fluctuating: 7136 },
    47: { erratic: 4963, fast: 5415, mediumFast: 6769, mediumSlow: 6798, slow: 8462, fluctuating: 9658 },
    48: { erratic: 4986, fast: 5646, mediumFast: 7057, mediumSlow: 7113, slow: 8821, fluctuating: 7903 },
    49: { erratic: 4999, fast: 5881, mediumFast: 7351, mediumSlow: 7437, slow: 9189, fluctuating: 10734 },
    50: { erratic: 6324, fast: 6120, mediumFast: 7651, mediumSlow: 7766, slow: 9563, fluctuating: 8722 },
    51: { erratic: 6471, fast: 6366, mediumFast: 7957, mediumSlow: 8103, slow: 9947, fluctuating: 11883 },
    52: { erratic: 6615, fast: 6615, mediumFast: 8269, mediumSlow: 8448, slow: 10336, fluctuating: 9592 },
    53: { erratic: 6755, fast: 6870, mediumFast: 8587, mediumSlow: 8799, slow: 10734, fluctuating: 13110 },
    54: { erratic: 6891, fast: 7129, mediumFast: 8911, mediumSlow: 9159, slow: 11138, fluctuating: 10515 },
    55: { erratic: 7023, fast: 7392, mediumFast: 9241, mediumSlow: 9524, slow: 11552, fluctuating: 14417 },
    56: { erratic: 7150, fast: 7662, mediumFast: 9577, mediumSlow: 9897, slow: 11971, fluctuating: 11492 },
    57: { erratic: 7274, fast: 7935, mediumFast: 9919, mediumSlow: 10278, slow: 12399, fluctuating: 15805 },
    58: { erratic: 7391, fast: 8214, mediumFast: 10267, mediumSlow: 10665, slow: 12833, fluctuating: 12526 },
    59: { erratic: 7506, fast: 8497, mediumFast: 10621, mediumSlow: 11061, slow: 13277, fluctuating: 17278 },
    60: { erratic: 7613, fast: 8784, mediumFast: 10981, mediumSlow: 11462, slow: 13726, fluctuating: 13616 },
    61: { erratic: 7715, fast: 9078, mediumFast: 11347, mediumSlow: 11871, slow: 14184, fluctuating: 18837 },
    62: { erratic: 7812, fast: 9375, mediumFast: 11719, mediumSlow: 12288, slow: 14648, fluctuating: 14766 },
    63: { erratic: 7903, fast: 9678, mediumFast: 12097, mediumSlow: 12711, slow: 15122, fluctuating: 20485 },
    64: { erratic: 7988, fast: 9985, mediumFast: 12481, mediumSlow: 13143, slow: 15601, fluctuating: 15976 },
    65: { erratic: 8065, fast: 10296, mediumFast: 12871, mediumSlow: 13580, slow: 16089, fluctuating: 22224 },
    66: { erratic: 8137, fast: 10614, mediumFast: 13267, mediumSlow: 14025, slow: 16583, fluctuating: 17247 },
    67: { erratic: 8201, fast: 10935, mediumFast: 13669, mediumSlow: 14478, slow: 17087, fluctuating: 24059 },
    68: { erratic: 9572, fast: 11262, mediumFast: 14077, mediumSlow: 14937, slow: 17596, fluctuating: 18581 },
    69: { erratic: 9052, fast: 11593, mediumFast: 14491, mediumSlow: 15405, slow: 18114, fluctuating: 25989 },
    70: { erratic: 9870, fast: 11928, mediumFast: 14911, mediumSlow: 15878, slow: 18638, fluctuating: 19980 },
    71: { erratic: 10030, fast: 12270, mediumFast: 15337, mediumSlow: 16359, slow: 19172, fluctuating: 28017 },
    72: { erratic: 9409, fast: 12615, mediumFast: 15769, mediumSlow: 16848, slow: 19711, fluctuating: 21446 },
    73: { erratic: 10307, fast: 12966, mediumFast: 16207, mediumSlow: 17343, slow: 20259, fluctuating: 30146 },
    74: { erratic: 10457, fast: 13321, mediumFast: 16651, mediumSlow: 17847, slow: 20813, fluctuating: 22978 },
    75: { erratic: 9724, fast: 13680, mediumFast: 17101, mediumSlow: 18356, slow: 21377, fluctuating: 32379 },
    76: { erratic: 10710, fast: 14046, mediumFast: 17557, mediumSlow: 18873, slow: 21946, fluctuating: 24580 },
    77: { erratic: 10847, fast: 14415, mediumFast: 18019, mediumSlow: 19398, slow: 22524, fluctuating: 34717 },
    78: { erratic: 9995, fast: 14790, mediumFast: 18487, mediumSlow: 19929, slow: 23108, fluctuating: 26252 },
    79: { erratic: 11073, fast: 15169, mediumFast: 18961, mediumSlow: 20469, slow: 23702, fluctuating: 37165 },
    80: { erratic: 11197, fast: 15552, mediumFast: 19441, mediumSlow: 21014, slow: 24301, fluctuating: 27995 },
    81: { erratic: 10216, fast: 15942, mediumFast: 19927, mediumSlow: 21567, slow: 24909, fluctuating: 39722 },
    82: { erratic: 11393, fast: 16335, mediumFast: 20419, mediumSlow: 22128, slow: 25523, fluctuating: 29812 },
    83: { erratic: 11504, fast: 16734, mediumFast: 20917, mediumSlow: 22695, slow: 26147, fluctuating: 42392 },
    84: { erratic: 10382, fast: 17137, mediumFast: 21421, mediumSlow: 23271, slow: 26776, fluctuating: 31704 },
    85: { erratic: 11667, fast: 17544, mediumFast: 21931, mediumSlow: 23852, slow: 27414, fluctuating: 45179 },
    86: { erratic: 11762, fast: 17958, mediumFast: 22447, mediumSlow: 24441, slow: 28058, fluctuating: 33670 },
    87: { erratic: 10488, fast: 18375, mediumFast: 22969, mediumSlow: 25038, slow: 28712, fluctuating: 48083 },
    88: { erratic: 11889, fast: 18798, mediumFast: 23497, mediumSlow: 25641, slow: 29371, fluctuating: 35715 },
    89: { erratic: 11968, fast: 19225, mediumFast: 24031, mediumSlow: 26253, slow: 30039, fluctuating: 51108 },
    90: { erratic: 10532, fast: 19656, mediumFast: 24571, mediumSlow: 26870, slow: 30713, fluctuating: 37839 },
    91: { erratic: 12056, fast: 20094, mediumFast: 25117, mediumSlow: 27495, slow: 31397, fluctuating: 54254 },
    92: { erratic: 12115, fast: 20535, mediumFast: 25669, mediumSlow: 28128, slow: 32086, fluctuating: 40043 },
    93: { erratic: 10508, fast: 20982, mediumFast: 26227, mediumSlow: 28767, slow: 32784, fluctuating: 57526 },
    94: { erratic: 12163, fast: 21433, mediumFast: 26791, mediumSlow: 29415, slow: 33488, fluctuating: 42330 },
    95: { erratic: 12202, fast: 21888, mediumFast: 27361, mediumSlow: 30068, slow: 34202, fluctuating: 60925 },
    96: { erratic: 10411, fast: 22350, mediumFast: 27937, mediumSlow: 30729, slow: 34921, fluctuating: 44699 },
    97: { erratic: 12206, fast: 22815, mediumFast: 28519, mediumSlow: 31398, slow: 35649, fluctuating: 64455 },
    98: { erratic: 8343, fast: 23286, mediumFast: 29107, mediumSlow: 32073, slow: 36383, fluctuating: 47153 },
    99: { erratic: 8118, fast: 23761, mediumFast: 29701, mediumSlow: 32757, slow: 37127, fluctuating: 68116 },
};
//total experience needed per level
const experienceTotalGrid = {
    1: { erratic: 0, fast: 0, mediumFast: 0, mediumSlow: 0, slow: 0, fluctuating: 0 },
    2: { erratic: 15, fast: 6, mediumFast: 8, mediumSlow: 9, slow: 10, fluctuating: 4 },
    3: { erratic: 52, fast: 21, mediumFast: 27, mediumSlow: 57, slow: 33, fluctuating: 13 },
    4: { erratic: 122, fast: 51, mediumFast: 64, mediumSlow: 96, slow: 80, fluctuating: 32 },
    5: { erratic: 237, fast: 100, mediumFast: 125, mediumSlow: 135, slow: 156, fluctuating: 65 },
    6: { erratic: 406, fast: 172, mediumFast: 216, mediumSlow: 179, slow: 270, fluctuating: 112 },
    7: { erratic: 637, fast: 274, mediumFast: 343, mediumSlow: 236, slow: 428, fluctuating: 178 },
    8: { erratic: 942, fast: 409, mediumFast: 512, mediumSlow: 314, slow: 640, fluctuating: 276 },
    9: { erratic: 1326, fast: 583, mediumFast: 729, mediumSlow: 419, slow: 911, fluctuating: 393 },
    10: { erratic: 1800, fast: 800, mediumFast: 1000, mediumSlow: 560, slow: 1250, fluctuating: 540 },
    11: { erratic: 2369, fast: 1064, mediumFast: 1331, mediumSlow: 742, slow: 1663, fluctuating: 745 },
    12: { erratic: 3041, fast: 1382, mediumFast: 1728, mediumSlow: 973, slow: 2160, fluctuating: 967 },
    13: { erratic: 3822, fast: 1757, mediumFast: 2197, mediumSlow: 1261, slow: 2746, fluctuating: 1230 },
    14: { erratic: 4719, fast: 2195, mediumFast: 2744, mediumSlow: 1612, slow: 3430, fluctuating: 1591 },
    15: { erratic: 5737, fast: 2700, mediumFast: 3375, mediumSlow: 2035, slow: 4218, fluctuating: 1957 },
    16: { erratic: 6881, fast: 3276, mediumFast: 4096, mediumSlow: 2535, slow: 5120, fluctuating: 2457 },
    17: { erratic: 8155, fast: 3930, mediumFast: 4913, mediumSlow: 3120, slow: 6141, fluctuating: 3046 },
    18: { erratic: 9564, fast: 4665, mediumFast: 5832, mediumSlow: 3798, slow: 7290, fluctuating: 3732 },
    19: { erratic: 11111, fast: 5487, mediumFast: 6859, mediumSlow: 4575, slow: 8573, fluctuating: 4526 },
    20: { erratic: 12800, fast: 6400, mediumFast: 8000, mediumSlow: 5460, slow: 10000, fluctuating: 5440 },
    21: { erratic: 14632, fast: 7408, mediumFast: 9261, mediumSlow: 6458, slow: 11576, fluctuating: 6482 },
    22: { erratic: 16610, fast: 8518, mediumFast: 10648, mediumSlow: 7577, slow: 13310, fluctuating: 7666 },
    23: { erratic: 18737, fast: 9733, mediumFast: 12167, mediumSlow: 8825, slow: 15208, fluctuating: 9003 },
    24: { erratic: 21012, fast: 11059, mediumFast: 13824, mediumSlow: 10208, slow: 17280, fluctuating: 10506 },
    25: { erratic: 23437, fast: 12500, mediumFast: 15625, mediumSlow: 11735, slow: 19531, fluctuating: 12187 },
    26: { erratic: 26012, fast: 14060, mediumFast: 17576, mediumSlow: 13411, slow: 21970, fluctuating: 14060 },
    27: { erratic: 28737, fast: 15746, mediumFast: 19683, mediumSlow: 15244, slow: 24603, fluctuating: 16140 },
    28: { erratic: 31610, fast: 17561, mediumFast: 21952, mediumSlow: 17242, slow: 27440, fluctuating: 18439 },
    29: { erratic: 34632, fast: 19511, mediumFast: 24389, mediumSlow: 19411, slow: 30486, fluctuating: 20974 },
    30: { erratic: 37800, fast: 21600, mediumFast: 27000, mediumSlow: 21760, slow: 33750, fluctuating: 23760 },
    31: { erratic: 41111, fast: 23832, mediumFast: 29791, mediumSlow: 24294, slow: 37238, fluctuating: 26811 },
    32: { erratic: 44564, fast: 26214, mediumFast: 32768, mediumSlow: 27021, slow: 40960, fluctuating: 30146 },
    33: { erratic: 48155, fast: 28749, mediumFast: 35937, mediumSlow: 29949, slow: 44921, fluctuating: 33780 },
    34: { erratic: 51881, fast: 31443, mediumFast: 39304, mediumSlow: 33084, slow: 49130, fluctuating: 37731 },
    35: { erratic: 55737, fast: 34300, mediumFast: 42875, mediumSlow: 36435, slow: 53593, fluctuating: 42017 },
    36: { erratic: 59719, fast: 37324, mediumFast: 46656, mediumSlow: 40007, slow: 58320, fluctuating: 46656 },
    37: { erratic: 63822, fast: 40522, mediumFast: 50653, mediumSlow: 43808, slow: 63316, fluctuating: 50653 },
    38: { erratic: 68041, fast: 43897, mediumFast: 54872, mediumSlow: 47846, slow: 68590, fluctuating: 55969 },
    39: { erratic: 72369, fast: 47455, mediumFast: 59319, mediumSlow: 52127, slow: 74148, fluctuating: 60505 },
    40: { erratic: 76800, fast: 51200, mediumFast: 64000, mediumSlow: 56660, slow: 80000, fluctuating: 66560 },
    41: { erratic: 81326, fast: 55136, mediumFast: 68921, mediumSlow: 61450, slow: 86151, fluctuating: 71677 },
    42: { erratic: 85942, fast: 59270, mediumFast: 74088, mediumSlow: 66505, slow: 92610, fluctuating: 78533 },
    43: { erratic: 90637, fast: 63605, mediumFast: 79507, mediumSlow: 71833, slow: 99383, fluctuating: 84277 },
    44: { erratic: 95406, fast: 68147, mediumFast: 85184, mediumSlow: 77440, slow: 106480, fluctuating: 91998 },
    45: { erratic: 100237, fast: 72900, mediumFast: 91125, mediumSlow: 83335, slow: 113906, fluctuating: 98415 },
    46: { erratic: 105122, fast: 77868, mediumFast: 97336, mediumSlow: 89523, slow: 121670, fluctuating: 107069 },
    47: { erratic: 110052, fast: 83058, mediumFast: 103823, mediumSlow: 96012, slow: 129778, fluctuating: 114205 },
    48: { erratic: 115015, fast: 88473, mediumFast: 110592, mediumSlow: 102810, slow: 138240, fluctuating: 123863 },
    49: { erratic: 120001, fast: 94119, mediumFast: 117649, mediumSlow: 109923, slow: 147061, fluctuating: 131766 },
    50: { erratic: 125000, fast: 100000, mediumFast: 125000, mediumSlow: 117360, slow: 156250, fluctuating: 142500 },
    51: { erratic: 131324, fast: 106120, mediumFast: 132651, mediumSlow: 125126, slow: 165813, fluctuating: 151222 },
    52: { erratic: 137795, fast: 112486, mediumFast: 140608, mediumSlow: 133229, slow: 175760, fluctuating: 163105 },
    53: { erratic: 144410, fast: 119101, mediumFast: 148877, mediumSlow: 141677, slow: 186096, fluctuating: 172697 },
    54: { erratic: 151165, fast: 125971, mediumFast: 157464, mediumSlow: 150476, slow: 196830, fluctuating: 185807 },
    55: { erratic: 158056, fast: 133100, mediumFast: 166375, mediumSlow: 159635, slow: 207968, fluctuating: 196322 },
    56: { erratic: 165079, fast: 140492, mediumFast: 175616, mediumSlow: 169159, slow: 219520, fluctuating: 210739 },
    57: { erratic: 172229, fast: 148154, mediumFast: 185193, mediumSlow: 179056, slow: 231491, fluctuating: 222231 },
    58: { erratic: 179503, fast: 156089, mediumFast: 195112, mediumSlow: 189334, slow: 243890, fluctuating: 238036 },
    59: { erratic: 186894, fast: 164303, mediumFast: 205379, mediumSlow: 199999, slow: 256723, fluctuating: 250562 },
    60: { erratic: 194400, fast: 172800, mediumFast: 216000, mediumSlow: 211060, slow: 270000, fluctuating: 267840 },
    61: { erratic: 202013, fast: 181584, mediumFast: 226981, mediumSlow: 222522, slow: 283726, fluctuating: 281456 },
    62: { erratic: 209728, fast: 190662, mediumFast: 238328, mediumSlow: 234393, slow: 297910, fluctuating: 300293 },
    63: { erratic: 217540, fast: 200037, mediumFast: 250047, mediumSlow: 246681, slow: 312558, fluctuating: 315059 },
    64: { erratic: 225443, fast: 209715, mediumFast: 262144, mediumSlow: 259392, slow: 327680, fluctuating: 335544 },
    65: { erratic: 233431, fast: 219700, mediumFast: 274625, mediumSlow: 272535, slow: 343281, fluctuating: 351520 },
    66: { erratic: 241496, fast: 229996, mediumFast: 287496, mediumSlow: 286115, slow: 359370, fluctuating: 373744 },
    67: { erratic: 249633, fast: 240610, mediumFast: 300763, mediumSlow: 300140, slow: 375953, fluctuating: 390991 },
    68: { erratic: 257834, fast: 251545, mediumFast: 314432, mediumSlow: 314618, slow: 393040, fluctuating: 415050 },
    69: { erratic: 267406, fast: 262807, mediumFast: 328509, mediumSlow: 329555, slow: 410636, fluctuating: 433631 },
    70: { erratic: 276458, fast: 274400, mediumFast: 343000, mediumSlow: 344960, slow: 428750, fluctuating: 459620 },
    71: { erratic: 286328, fast: 286328, mediumFast: 357911, mediumSlow: 360838, slow: 447388, fluctuating: 479600 },
    72: { erratic: 296358, fast: 298598, mediumFast: 373248, mediumSlow: 377197, slow: 466560, fluctuating: 507617 },
    73: { erratic: 305767, fast: 311213, mediumFast: 389017, mediumSlow: 394045, slow: 486271, fluctuating: 529063 },
    74: { erratic: 316074, fast: 324179, mediumFast: 405224, mediumSlow: 411388, slow: 506530, fluctuating: 559209 },
    75: { erratic: 326531, fast: 337500, mediumFast: 421875, mediumSlow: 429235, slow: 527343, fluctuating: 582187 },
    76: { erratic: 336255, fast: 351180, mediumFast: 438976, mediumSlow: 447591, slow: 548720, fluctuating: 614566 },
    77: { erratic: 346965, fast: 365226, mediumFast: 456533, mediumSlow: 466464, slow: 570666, fluctuating: 639146 },
    78: { erratic: 357812, fast: 379641, mediumFast: 474552, mediumSlow: 485862, slow: 593190, fluctuating: 673863 },
    79: { erratic: 367807, fast: 394431, mediumFast: 493039, mediumSlow: 505791, slow: 616298, fluctuating: 700115 },
    80: { erratic: 378880, fast: 409600, mediumFast: 512000, mediumSlow: 526260, slow: 640000, fluctuating: 737280 },
    81: { erratic: 390077, fast: 425152, mediumFast: 531441, mediumSlow: 547274, slow: 664301, fluctuating: 765275 },
    82: { erratic: 400293, fast: 441094, mediumFast: 551368, mediumSlow: 568841, slow: 689210, fluctuating: 804997 },
    83: { erratic: 411686, fast: 457429, mediumFast: 571787, mediumSlow: 590969, slow: 714733, fluctuating: 834809 },
    84: { erratic: 423190, fast: 474163, mediumFast: 592704, mediumSlow: 613664, slow: 740880, fluctuating: 877201 },
    85: { erratic: 433572, fast: 491300, mediumFast: 614125, mediumSlow: 636935, slow: 767656, fluctuating: 908905 },
    86: { erratic: 445239, fast: 508844, mediumFast: 636056, mediumSlow: 660787, slow: 795070, fluctuating: 954084 },
    87: { erratic: 457001, fast: 526802, mediumFast: 658503, mediumSlow: 685228, slow: 823128, fluctuating: 987754 },
    88: { erratic: 467489, fast: 545177, mediumFast: 681472, mediumSlow: 710266, slow: 851840, fluctuating: 1035837 },
    89: { erratic: 479378, fast: 563975, mediumFast: 704969, mediumSlow: 735907, slow: 881211, fluctuating: 1071552 },
    90: { erratic: 491346, fast: 583200, mediumFast: 729000, mediumSlow: 762160, slow: 911250, fluctuating: 1122660 },
    91: { erratic: 501878, fast: 602856, mediumFast: 753571, mediumSlow: 789030, slow: 941963, fluctuating: 1160499 },
    92: { erratic: 513934, fast: 622950, mediumFast: 778688, mediumSlow: 816525, slow: 973360, fluctuating: 1214753 },
    93: { erratic: 526049, fast: 643485, mediumFast: 804357, mediumSlow: 844653, slow: 1005446, fluctuating: 1254796 },
    94: { erratic: 536557, fast: 664467, mediumFast: 830584, mediumSlow: 873420, slow: 1038230, fluctuating: 1312322 },
    95: { erratic: 548720, fast: 685900, mediumFast: 857375, mediumSlow: 902835, slow: 1071718, fluctuating: 1354652 },
    96: { erratic: 560922, fast: 707788, mediumFast: 884736, mediumSlow: 932903, slow: 1105920, fluctuating: 1415577 },
    97: { erratic: 571333, fast: 730138, mediumFast: 912673, mediumSlow: 963632, slow: 1140841, fluctuating: 1460276 },
    98: { erratic: 583539, fast: 752953, mediumFast: 941192, mediumSlow: 995030, slow: 1176490, fluctuating: 1524731 },
    99: { erratic: 591882, fast: 776239, mediumFast: 970299, mediumSlow: 1027103, slow: 1212873, fluctuating: 1571884 },
};