
/*  将动画分解成两部分，撞击前的一部分，撞击后的一部分
    从视频上看，每个动画长度大约4秒，撞击发生在大约2秒左右
    编程实现：撞击前运行1.6s，撞击后运动2.4s
    不参加撞击的球的总运动距离是150 + 220
*/

const B_TIMER1 = 1600;
const B_TIMER2 = 2400;
const B_PATH1 = 155;
const B_PATH2 = 220;

const F_TIMER1 = 1500;
const F_TIMER2 = 2500;
const F_TIMER3 = 1000;
const F_TIMER4 = 3000;
const F_PATH1 = 150;
const F_PATH2 = 250;
const F_PATH3 = 0;
const F_PATH4 = 270;
const F_PATH5 = 135;


//fishs -> 单独的鱼静止时间长
//fishg -> 群体的鱼静止时间长
const FishBallMeta = [
	//GroupConvergences
	{
		direction: "left",
		fb: "fishs",
		green:{pos:40, path1:F_PATH3, path2:F_PATH4},
		yellow:{pos:75, path1:F_PATH3, path2:F_PATH4},
		white:{pos:5, path1:F_PATH3, path2:F_PATH4},
		blue:{pos:525, path1:0, path2:-135, flipx:true},
		red:{pos:30, path1:F_PATH3, path2:F_PATH4}
	},
	//GroupDivergences
	{
		direction: "right",
		fb: "fishs",
		green:{pos:215, path1:F_PATH3, path2:F_PATH4},
		yellow:{pos:180, path1:F_PATH3, path2:F_PATH4},
		white:{pos:250, path1:F_PATH3, path2:F_PATH4},
		blue:{pos:145, path1:0, path2:-135, flipx:true},
		red:{pos:225, path1:F_PATH3, path2:F_PATH4}
	},	
	//IndividualConvergences
	{
		direction: "left",
		fb: "fishg",
		green:{pos:40, path1:F_PATH3, path2:F_PATH5},
		yellow:{pos:75, path1:F_PATH3, path2:F_PATH5},
		white:{pos:5, path1:F_PATH3, path2:F_PATH5},
		blue:{pos:525, path1:0, path2:-270, flipx:true},
		red:{pos:30, path1:F_PATH3, path2:F_PATH5}
	},
	//IndividualDivergences
	{
		direction: "right",
		fb: "fishg",
		green:{pos:350, path1:F_PATH3, path2:F_PATH5},
		yellow:{pos:315, path1:F_PATH3, path2:F_PATH5},
		white:{pos:385, path1:F_PATH3, path2:F_PATH5},
		blue:{pos:270, path1:0, path2:-270, flipx:true},
		red:{pos:360, path1:F_PATH3, path2:F_PATH5}
	},

	//GroupConvergences2
	{
		direction: "right",
		fb: "fishs",
		green:{pos:40, path1:F_PATH3, path2:F_PATH4},
		yellow:{pos:75, path1:F_PATH3, path2:F_PATH4},
		white:{pos:5, path1:F_PATH3, path2:F_PATH4},
		blue:{pos:525, path1:0, path2:-135, flipx:true},
		red:{pos:30, path1:F_PATH3, path2:F_PATH4}
	},
	//GroupDivergences2
	{
		direction: "left",
		fb: "fishs",
		green:{pos:215, path1:F_PATH3, path2:F_PATH4},
		yellow:{pos:180, path1:F_PATH3, path2:F_PATH4},
		white:{pos:250, path1:F_PATH3, path2:F_PATH4},
		blue:{pos:145, path1:0, path2:-135, flipx:true},
		red:{pos:225, path1:F_PATH3, path2:F_PATH4}
	},
	//IndividualConvergences2
	{
		direction: "right",
		fb: "fishg",
		green:{pos:40, path1:F_PATH3, path2:F_PATH5},
		yellow:{pos:75, path1:F_PATH3, path2:F_PATH5},
		white:{pos:5, path1:F_PATH3, path2:F_PATH5},
		blue:{pos:525, path1:0, path2:-270, flipx:true},
		red:{pos:30, path1:F_PATH3, path2:F_PATH5}
	},
	//IndividualDivergences2
	{
		direction: "left",
		fb: "fishg",
		green:{pos:350, path1:F_PATH3, path2:F_PATH5},
		yellow:{pos:315, path1:F_PATH3, path2:F_PATH5},
		white:{pos:385, path1:F_PATH3, path2:F_PATH5},
		blue:{pos:270, path1:0, path2:-270, flipx:true},
		red:{pos:360, path1:F_PATH3, path2:F_PATH5}
	},

	//GroupEntrains
	{
		direction: "left",
		fb: "fish",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:75, path1:B_PATH1, path2:B_PATH2},
		white:{pos:5, path1:B_PATH1, path2:B_PATH2},
		blue:{pos:295, path1:0, path2:B_PATH2},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},
	//GroupJoins
	{
		direction: "left",
		fb: "fish",
		green:{pos:40, path1:240, path2:150},
		yellow:{pos:75, path1:240, path2:150},
		white:{pos:5, path1:240, path2:150},
		blue:{pos:270, path1:100, path2:150},
		red:{pos:30, path1:240, path2:150}
	},
	//GroupLaunches
	{
		direction: "left",
		fb: "fish",
		green:{pos:40, path1:B_PATH1, path2:0},
		yellow:{pos:75, path1:B_PATH1, path2:0},
		white:{pos:5, path1:B_PATH1, path2:0},
		blue:{pos:300, path1:0, path2:B_PATH2},
		red:{pos:30, path1:B_PATH1, path2:0}
	},
	//GroupLeaves
	{
		direction: "left",
		fb: "fish",
		green:{pos:125, path1:100, path2:270},
		yellow:{pos:75, path1:100, path2:270},
		white:{pos:150, path1:100, path2:270},
		blue:{pos:5, path1:100, path2:150},
		red:{pos:115, path1:100, path2:270}
	},

	//IndividualEntrains
	{
		direction: "left",
		fb: "fish",
		green:{pos:190, path1:0, path2:B_PATH2},
		yellow:{pos:225, path1:0, path2:B_PATH2},
		white:{pos:295, path1:0, path2:B_PATH2},
		blue:{pos:5, path1:B_PATH1, path2:B_PATH2},
		red:{pos:180, path1:0, path2:B_PATH2}
	},
	//IndividualJoins
	{
		direction: "left",
		fb: "fish",
		green:{pos:235, path1:100, path2:150},
		yellow:{pos:200, path1:100, path2:150},
		white:{pos:270, path1:100, path2:150},
		blue:{pos:5, path1:240, path2:150},
		red:{pos:225, path1:100, path2:150}
	},
	//IndividualLaunches
	{
		direction: "left",
		fb: "fish",
		green:{pos:265, path1:0, path2:B_PATH2},
		yellow:{pos:230, path1:0, path2:B_PATH2},
		white:{pos:300, path1:0, path2:B_PATH2},
		blue:{pos:5, path1:B_PATH1, path2:0},
		red:{pos:255, path1:0, path2:B_PATH2}
	},
	//IndividualLeaves
	{
		direction: "left",
		fb: "fish",
		green:{pos:125, path1:100, path2:150},
		yellow:{pos:75, path1:100, path2:150},
		white:{pos:5, path1:100, path2:150},
		blue:{pos:150, path1:100, path2:270},
		red:{pos:115, path1:100, path2:150}
	},

	//GroupEntrains2
	{
		direction: "right",
		fb: "fish",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:75, path1:B_PATH1, path2:B_PATH2},
		white:{pos:5, path1:B_PATH1, path2:B_PATH2},
		blue:{pos:295, path1:0, path2:B_PATH2},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},
	//GroupJoins2
	{
		direction: "right",
		fb: "fish",
		green:{pos:40, path1:240, path2:150},
		yellow:{pos:75, path1:240, path2:150},
		white:{pos:5, path1:240, path2:150},
		blue:{pos:270, path1:100, path2:150},
		red:{pos:30, path1:240, path2:150}
	},
	//GroupLaunches2
	{
		direction: "right",
		fb: "fish",
		green:{pos:40, path1:B_PATH1, path2:0},
		yellow:{pos:75, path1:B_PATH1, path2:0},
		white:{pos:5, path1:B_PATH1, path2:0},
		blue:{pos:300, path1:0, path2:B_PATH2},
		red:{pos:30, path1:B_PATH1, path2:0}
	},
	//GroupLeaves2
	{
		direction: "right",
		fb: "fish",
		green:{pos:125, path1:100, path2:270},
		yellow:{pos:75, path1:100, path2:270},
		white:{pos:150, path1:100, path2:270},
		blue:{pos:5, path1:100, path2:150},
		red:{pos:115, path1:100, path2:270}
	},

	//IndividualEntrains2
	{
		direction: "right",
		fb: "fish",
		green:{pos:190, path1:0, path2:B_PATH2},
		yellow:{pos:225, path1:0, path2:B_PATH2},
		white:{pos:295, path1:0, path2:B_PATH2},
		blue:{pos:5, path1:B_PATH1, path2:B_PATH2},
		red:{pos:180, path1:0, path2:B_PATH2}
	},
	//IndividualJoins2
	{
		direction: "right",
		fb: "fish",
		green:{pos:235, path1:100, path2:150},
		yellow:{pos:200, path1:100, path2:150},
		white:{pos:270, path1:100, path2:150},
		blue:{pos:5, path1:240, path2:150},
		red:{pos:225, path1:100, path2:150}
	},
	//IndividualLaunches2
	{
		direction: "right",
		fb: "fish",
		green:{pos:265, path1:0, path2:B_PATH2},
		yellow:{pos:230, path1:0, path2:B_PATH2},
		white:{pos:300, path1:0, path2:B_PATH2},
		blue:{pos:5, path1:B_PATH1, path2:0},
		red:{pos:255, path1:0, path2:B_PATH2}
	},
	//IndividualLeaves2
	{
		direction: "right",
		fb: "fish",
		green:{pos:125, path1:100, path2:150},
		yellow:{pos:75, path1:100, path2:150},
		white:{pos:5, path1:100, path2:150},
		blue:{pos:150, path1:100, path2:270},
		red:{pos:115, path1:100, path2:150}
	},

	/**********************************************************
	 ball start
	 **********************************************************/
	//DVLCollisionDDDV
	{
		direction: "left",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:-40},
		blue:{pos:200, path1:100, path2:B_PATH2},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},
	//DVLCollisionSDDV
	{
		direction: "left",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:60},
		blue:{pos:200, path1:100, path2:B_PATH2},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},
	//DVLCollisionSDSV
	{
		direction: "left",
		fb: "ball",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:B_PATH2},
		blue:{pos:200, path1:100, path2:B_PATH2},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},
	//DVLCollisionStopMove
	{
		direction: "left",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:0},
		blue:{pos:200, path1:100, path2:B_PATH2},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},

	//DVRCollisionDDDV
	{
		direction: "right",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:-40},
		blue:{pos:200, path1:100, path2:B_PATH2},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},
	//DVRCollisionSDDV
	{
		direction: "right",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:60},
		blue:{pos:200, path1:100, path2:B_PATH2},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},
	//DVRCollisionSDSV
	{
		direction: "right",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:B_PATH2},
		blue:{pos:200, path1:100, path2:B_PATH2},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},
	//DVRCollisionStopMove
	{
		direction: "right",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:0},
		blue:{pos:200, path1:100, path2:B_PATH2},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},

	//LauchingDDDV
	{
		direction: "left",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:-40},
		blue:{pos:300, path1:0, path2:B_PATH2},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},
	//LauchingSDDV
	{
		direction: "left",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:60},
		blue:{pos:300, path1:0, path2:B_PATH2},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},
	//LauchingSDSV
	{
		direction: "left",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:B_PATH2},
		blue:{pos:300, path1:0, path2:B_PATH2},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},
	//LauchingStopMove
	{
		direction: "left",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:0},
		blue:{pos:300, path1:0, path2:B_PATH2},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},

	//ReversLauchingDDDV
	{
		direction: "right",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:-40},
		blue:{pos:300, path1:0, path2:B_PATH2},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},
	//ReversLauchingSDDV
	{
		direction: "right",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:60},
		blue:{pos:300, path1:0, path2:B_PATH2},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},
	//ReversLauchingSDSV
	{
		direction: "right",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:B_PATH2},
		blue:{pos:300, path1:0, path2:B_PATH2},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},
	//ReversLauchingStopMove
	{
		direction: "right",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:0},
		blue:{pos:300, path1:0, path2:B_PATH2},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},

	//SVLCollisionDDDV
	{
		direction: "right",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:-60},
		blue:{pos:520, path1:-B_PATH2, path2:120},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},
	//SVLCollisionSDDV
	{
		direction: "right",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:40},
		blue:{pos:520, path1:-B_PATH2, path2:120},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},
	//SVLCollisionSDSV
	{
		direction: "right",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:60},
		blue:{pos:520, path1:-B_PATH2, path2:60},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},
	//SVLCollisionStopMove
	{
		direction: "right",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:0},
		blue:{pos:520, path1:-B_PATH2, path2:120},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},

	//SVRCollisionDDDV
	{
		direction: "left",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:-60},
		blue:{pos:520, path1:-B_PATH2, path2:120},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},
	//SVRCollisionSDDV
	{
		direction: "left",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:40},
		blue:{pos:520, path1:-B_PATH2, path2:120},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},
	//SVRCollisionSDSV
	{
		direction: "left",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:60},
		blue:{pos:520, path1:-B_PATH2, path2:60},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	},
	//SVRCollisionStopMove
	{
		direction: "left",
		fb: "ball",
		green:{pos:40, path1:B_PATH1, path2:B_PATH2},
		yellow:{pos:5, path1:B_PATH1, path2:B_PATH2},
		white:{pos:75, path1:B_PATH1, path2:0},
		blue:{pos:520, path1:-B_PATH2, path2:120},
		red:{pos:30, path1:B_PATH1, path2:B_PATH2}
	}
];

const FishBallTitle = [
	'The blue fish swims like this because:',
	'The blue ball moves like this because:',
	'The blue fish swims like this because:',
	'The blue ball moves like this because:',
	'Please judge the moving direction of the blue fish:',
	'Please judge the moving direction of the blue ball:'
];

const BallFeQue = [
"The blue ball moves to the left.",
"The blue ball moves to the right.",
"The blue ball moves to the left.",
"The blue ball moves to the right.",
"The blue ball moves to the left.",
"The blue ball moves to the right.",
"The blue ball moves to the left."
];

const BallInQue = [
"The blue ball has greater weight.",
"The blue ball has no motive power itself.",
"The blue ball has slower starting speed.",
"The blue ball was moving.",
"The blue ball has greater weight.",
"The blue ball has no motive power itself.",
"The blue ball has slower starting speed.",
"The blue ball was moving.",
"The blue ball has greater weight.",
"The blue ball was static.",
"The blue ball has less weight.",
"The blue ball was moving.",
"The blue ball has greater weight.",
"The blue ball was static.",
"The blue ball has less weight.",
"The blue ball was moving.",
"The blue ball has faster starting speed.",
"The blue ball has less weight.",
"The blue ball was moving.",
"The blue ball has no motive power itself.",
"The blue ball has faster starting speed.",
"The blue ball has less weight.",
"The blue ball was moving.",
"The blue ball has no motive power itself."
];

const BallExQue = [
"The grey ball has less weight.",
"The grey ball moves at slower speed.",
"The grey ball moves at faster speed.",
"The air resistance is small.",
"The grey ball has less weight.",
"The grey ball moves at slower speed.",
"The grey ball moves at faster speed.",
"The air resistance is small.",
"The grey ball has less weight.",
"The air resistance is large.",
"The grey ball moves at faster speed.",
"The air resistance is large.",
"The grey ball has less weight.",
"The air resistance is large.",
"The grey ball moves at faster speed.",
"The air resistance is large.",
"The grey ball moves at slower speed.",
"The grey ball has greater weight.",
"The air resistance is large.",
"The air resistance is large.",
"The grey ball moves at slower speed.",
"The grey ball has greater weight.",
"The air resistance is large.",
"The air resistance is large."
];

const FishFeQue = [
"The blue fish swims to the left.",
"The blue fish swims to the right.",
"The blue fish swims to the left.",
"The blue fish swims to the right.",
"The blue fish swims to the left.",
"The blue fish swims to the right.",
"The blue fish swims to the left."
];

const FishInQue = [
"The blue fish is waiting for other fishes.",
"The blue fish is waiting for other fishes.",
"The blue fish wants to be alone.",
"The blue fish wants to be alone.",
"The blue fish wants to be the first one swims to the center.",
"The blue fish wants to be the first one swims to the center.",
"The blue fish wants to leave the group.",
"The blue fish wants to leave the group.",
"The blue fish is waiting for other fishes.",
"The blue fish is waiting for other fishes.",
"The blue fish drives other fishes away.",
"The blue fish drives other fishes away.",
"The blue fish hates other fishes.",
"The blue fish hates other fishes.",
"The blue fish wants to take up the place.",
"The blue fish wants to take up the place.",
"The blue fish is waiting for other fishes.",
"The blue fish is waiting for other fishes.",
"The blue fish wants to join other fishes.",
"The blue fish wants to join other fishes.",
"The blue fish wants to be alone.",
"The blue fish wants to be alone.",
"The blue fish wants to leave the group.",
"The blue fish wants to leave the group."
];

const FishExQue = [
"Other fishes will swim to the center first.",
"Other fishes will swim to the center first.",
"Other fishes want to get rid of the blue fish.",
"Other fishes want to get rid of the blue fish.",
"Other fishes are waiting for the blue fish.",
"Other fishes are waiting for the blue fish.",
"Other fishes hate blue fish.",
"Other fishes hate blue fish.",
"Other fishes want to swim with the blue fish.",
"Other fishes want to swim with the blue fish.",
"Other fishes are waiting for the blue fish.",
"Other fishes are waiting for the blue fish.",
"Other fishes drive the blue fish away.",
"Other fishes drive the blue fish away.",
"Other fishes want to take up the place.",
"Other fishes want to take up the place.",
"Other fishes want to swim with the blue fish.",
"Other fishes want to swim with the blue fish.",
"Other fishes are waiting for the blue fish.",
"Other fishes are waiting for the blue fish.",
"Other fishes want to get rid of the blue fish.",
"Other fishes want to get rid of the blue fish.",
"Other fishes swim slower than the blue fishes.",
"Other fishes swim slower than the blue fishes."
];