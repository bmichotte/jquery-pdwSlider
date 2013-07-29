###jQuery pdwSlider

This is a simple script to make a div slide
    
Look at example/index.html for use.

## available methods
```
$('#myCoverflow').pdwSlider('start');
$('#myCoverflow').pdwSlider('stop');
$('#myCoverflow').pdwSlider('previous');
$('#myCoverflow').pdwSlider('next');

```

## available options
```
{
    animationSpeed: 500,
    animationDelay: 4500,
    beforeChange: false|function,
    afterChange: false|function,
    easing: "swing",
    previousButton: "selector",
    nextButton: "selector",
}
```