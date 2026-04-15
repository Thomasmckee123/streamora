export interface Video {
	id: string;
	title: string;
	thumbnail: string;
	channel: string;
	views: string;
	timestamp: string;
	videoUrl: string;
}

export const videos: Video[] = [
	{
		id: '1',
		title: 'Big Buck Bunny',
		thumbnail: 'https://peach.blender.org/wp-content/uploads/bbb-splash.png',
		channel: 'Blender Foundation',
		views: '12M views',
		timestamp: '14 years ago',
		videoUrl:
			'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
	},
	{
		id: '2',
		title: 'Elephant Dream',
		thumbnail: 'https://picsum.photos/seed/elephant/640/360',
		channel: 'Blender Foundation',
		views: '8.5M views',
		timestamp: '16 years ago',
		videoUrl:
			'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
	},
	{
		id: '3',
		title: 'For Bigger Blazes',
		thumbnail: 'https://picsum.photos/seed/blazes/640/360',
		channel: 'Google',
		views: '2.1M views',
		timestamp: '8 years ago',
		videoUrl:
			'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
	},
	{
		id: '4',
		title: 'For Bigger Escapes',
		thumbnail: 'https://picsum.photos/seed/escapes/640/360',
		channel: 'Google',
		views: '1.8M views',
		timestamp: '8 years ago',
		videoUrl:
			'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
	},
	{
		id: '5',
		title: 'For Bigger Fun',
		thumbnail: 'https://picsum.photos/seed/fun/640/360',
		channel: 'Google',
		views: '3.2M views',
		timestamp: '8 years ago',
		videoUrl:
			'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
	},
	{
		id: '6',
		title: 'For Bigger Joyrides',
		thumbnail: 'https://picsum.photos/seed/joyrides/640/360',
		channel: 'Google',
		views: '4.7M views',
		timestamp: '8 years ago',
		videoUrl:
			'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
	},
	{
		id: '7',
		title: 'Sintel',
		thumbnail: 'https://picsum.photos/seed/sintel/640/360',
		channel: 'Blender Foundation',
		views: '10M views',
		timestamp: '12 years ago',
		videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
	},
	{
		id: '8',
		title: 'Tears of Steel',
		thumbnail: 'https://picsum.photos/seed/tears/640/360',
		channel: 'Blender Foundation',
		views: '6.3M views',
		timestamp: '10 years ago',
		videoUrl:
			'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
	}
];
