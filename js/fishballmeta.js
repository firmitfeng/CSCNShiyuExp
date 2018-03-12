
/*  将动画分解成两部分，撞击前的一部分，撞击后的一部分
    从视频上看，每个动画长度大约4秒，撞击发生在大约2秒左右
    编程实现：撞击前运行1.6s，撞击后运动2.4s
    不参加撞击的球的总运动距离是150 + 220
*/

const TIMER1 = 1600;
const TIMER2 = 2400;
const B_PATH1 = 155;
const B_PATH2 = 220;

const FishBallMeta = [

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