
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
	//IndividualJoins
	{
		direction: "right",
		fb: "fish",
		green:{pos:235, path1:100, path2:150},
		yellow:{pos:200, path1:100, path2:150},
		white:{pos:270, path1:100, path2:150},
		blue:{pos:5, path1:240, path2:150},
		red:{pos:225, path1:100, path2:150}
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

const BallFeQue = [
"蓝球最后向左",
"蓝球最后向右",
"蓝球最后向左",
"蓝球最后向右",
"蓝球最后向左",
"蓝球最后向右",
"蓝球最后向左"
];

const BallInQue = [
"蓝球质量较大",
"蓝球自身无动力",
"蓝球起始速度较小",
"蓝球原来运动",
"蓝球质量较大",
"蓝球自身无动力",
"蓝球起始速度较小",
"蓝球原来运动",
"蓝球质量较大",
"蓝球原来静止",
"蓝球质量较小",
"蓝球自身有动力",
"蓝球质量较大",
"蓝球原来静止",
"蓝球质量较小",
"蓝球自身有动力",
"蓝球起始速度较大",
"蓝球质量较小",
"蓝球原来运动",
"蓝球自身无动力",
"蓝球起始速度较大",
"蓝球质量较小",
"蓝球原来运动",
"蓝球自身无动力"
];

const BallExQue = [
"灰球质量较小",
"灰球速度较小",
"灰球速度较大",
"空气阻力较小",
"灰球质量较小",
"灰球速度较小",
"灰球速度较大",
"空气阻力较小",
"灰球质量较小",
"空气阻力较大",
"灰球速度较大",
"摩擦阻力较小",
"灰球质量较小",
"空气阻力较大",
"灰球速度较大",
"摩擦阻力较小",
"灰球速度较小",
"灰球质量较大",
"空气阻力较大",
"摩擦阻力较小",
"灰球速度较小",
"灰球质量较大",
"空气阻力较大",
"摩擦阻力较小"
];

const FishFeQue = [
"蓝鱼向左游",
"蓝鱼向右游",
"蓝鱼向左游",
"蓝鱼向右游",
"蓝鱼向左游",
"蓝鱼向右游",
"蓝鱼向左游"
];

const FishInQue = [
"蓝鱼在等其它鱼",
"蓝鱼在等其它鱼",
"蓝鱼想独自活动",
"蓝鱼想独自活动",
"蓝鱼想先游到中间",
"蓝鱼想先游到中间",
"蓝鱼想离开其它鱼",
"蓝鱼想离开其它鱼",
"蓝鱼在等其它鱼",
"蓝鱼在等其它鱼",
"蓝鱼驱赶其它鱼",
"蓝鱼驱赶其它鱼",
"蓝鱼讨厌其它鱼",
"蓝鱼讨厌其它鱼",
"蓝鱼想占有空间",
"蓝鱼想占有空间",
"蓝鱼在等其它鱼",
"蓝鱼在等其它鱼",
"蓝鱼想加入其它鱼",
"蓝鱼想加入其它鱼",
"蓝鱼想独自活动",
"蓝鱼想独自活动",
"蓝鱼想离开其它鱼",
"蓝鱼想离开其它鱼"
];

const FishExQue = [
"其它鱼会先游到中间",
"其它鱼会先游到中间",
"其它鱼想甩掉蓝鱼",
"其它鱼想甩掉蓝鱼",
"其它鱼在等蓝鱼",
"其它鱼在等蓝鱼",
"其它鱼不喜欢蓝鱼",
"其它鱼不喜欢蓝鱼",
"其它鱼想和蓝鱼一起游",
"其它鱼想和蓝鱼一起游",
"其它鱼在等蓝鱼",
"其它鱼在等蓝鱼",
"其它鱼赶走蓝鱼",
"其它鱼赶走蓝鱼",
"其它鱼想占有空间",
"其它鱼想占有空间",
"其它鱼想和蓝鱼一起游",
"其它鱼想和蓝鱼一起游",
"其它鱼在等蓝鱼",
"其它鱼在等蓝鱼",
"其它鱼想甩掉蓝鱼",
"其它鱼想甩掉蓝鱼",
"其它鱼游得比蓝鱼慢",
"其它鱼游得比蓝鱼慢"
];