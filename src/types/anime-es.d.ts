declare module 'animejs/lib/anime.es.js' {
  namespace anime {
    type EasingOptions =
      | 'easeInQuad'
      | 'easeInCubic'
      | 'easeInQuart'
      | 'easeInQuint'
      | 'easeInSine'
      | 'easeInExpo'
      | 'easeInCirc'
      | 'easeInBack'
      | 'easeInElastic'
      | 'easeInBounce'
      | 'easeOutQuad'
      | 'easeOutCubic'
      | 'easeOutQuart'
      | 'easeOutQuint'
      | 'easeOutSine'
      | 'easeOutExpo'
      | 'easeOutCirc'
      | 'easeOutBack'
      | 'easeOutElastic'
      | 'easeOutBounce'
      | 'easeInOutQuad'
      | 'easeInOutCubic'
      | 'easeInOutQuart'
      | 'easeInOutQuint'
      | 'easeInOutSine'
      | 'easeInOutExpo'
      | 'easeInOutCirc'
      | 'easeInOutBack'
      | 'easeInOutElastic'
      | 'easeInOutBounce'
      | string;
    
    interface AnimeParams {
      targets: any;
      duration?: number;
      delay?: number | Function;
      elasticity?: number;
      round?: number | boolean;
      easing?: EasingOptions | Function;
      direction?: 'normal' | 'reverse' | 'alternate';
      loop?: number | boolean;
      autoplay?: boolean;
      begin?: Function;
      update?: Function;
      complete?: Function;
      [prop: string]: any;
    }

    function stagger(value: number | string, options?: Object): Function;
    function random(min: number, max: number): number;
    function timeline(params?: AnimeParams): any;
    const version: string;
  }

  const anime: {
    (params: anime.AnimeParams): any;
    stagger: typeof anime.stagger;
    random: typeof anime.random;
    timeline: typeof anime.timeline;
    version: string;
  };
  
  export default anime;
} 