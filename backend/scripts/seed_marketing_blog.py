import sys
import os
import re
from datetime import datetime, timezone

# Add the backend directory to sys.path to allow importing app modules
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.db.session import SessionLocal
from app.models.blog_post import BlogPost

def slugify(value: str) -> str:
    value = value.lower()
    value = re.sub(r'[^a-z0-9]+', '-', value)
    value = re.sub(r'(^-|-$)', '', value)
    return value

POSTS = [
    # M&A Strategy
    {
        "title": "The First 100 Days: A Strategic Framework for Post-Merger Success",
        "category": "M&A Strategy",
        "content": "The first 100 days following a merger or acquisition are critical for setting the tone and trajectory of the integrated entity. This period is where value is either captured or lost. A well-structured plan focuses on stabilizing operations, securing key talent, and executing on early synergy wins. In this guide, we break down the essential phases of the first 100 days, from Day 1 readiness to the first quarterly review.",
    },
    {
        "title": "Why 70% of M&A Deals Fail to Realize Synergy Targets",
        "category": "M&A Strategy",
        "content": "Statistics show that a significant majority of M&A deals fail to deliver the shareholder value promised at announcement. The culprit is often poor integration execution and cultural misalignment. We analyze the common pitfalls—including overestimated synergies, lack of clear leadership, and IT integration nightmares—and provide actionable strategies to ensure your deal is in the winning 30%.",
    },
    {
        "title": "Buy-and-Build Strategy: Scaling Your Portfolio in 2025",
        "category": "M&A Strategy",
        "content": "Buy-and-build remains a potent strategy for private equity and corporate acquirers. By acquiring a platform company and bolting on smaller add-ons, firms can achieve rapid scale and multiple arbitrage. However, the complexity of integrating multiple cultures and systems increases exponentially. This article explores modern approaches to buy-and-build in a high-interest-rate environment.",
    },
    {
        "title": "Due Diligence Redefined: Integrating AI into Your Deal Flow",
        "category": "M&A Strategy",
        "content": "Traditional due diligence is manual, slow, and prone to human error. AI is revolutionizing this process by automating document analysis, flagging legal risks, and assessing financial health in seconds. We discuss how forward-thinking deal teams are using ApexDeliver's AI capabilities to speed up diligence by 40% and uncover risks that manual review might miss.",
    },
    {
        "title": "The Role of Culture in Cross-Border Acquisitions",
        "category": "M&A Strategy",
        "content": "Cross-border deals offer massive growth potential but come with unique cultural challenges. From communication styles to decision-making hierarchies, ignoring culture can doom a deal. We share insights on conducting cultural due diligence and creating an integration plan that respects local nuances while driving global unity.",
    },
    {
        "title": "Exit Strategy 101: Preparing Your Business for Sale from Day One",
        "category": "M&A Strategy",
        "content": "The best time to plan your exit is at the beginning. Building a sellable business means maintaining clean financials, robust systems, and a management team that doesn't rely solely on the founder. This guide covers the operational and financial hygiene required to maximize your valuation when the exit window opens.",
    },
    {
        "title": "Private Equity Trends: What LPs Expect in the Next Cycle",
        "category": "M&A Strategy",
        "content": "Limited Partners (LPs) are demanding more transparency, better ESG compliance, and faster returns. GPs must adapt their value creation playbooks to meet these expectations. We explore the shifting landscape of private equity, from the rise of private credit to the focus on operational improvements over financial engineering.",
    },

    # FP&A
    {
        "title": "Cash is King: Implementing a 13-Week Cash Flow Forecast",
        "category": "FP&A",
        "content": "Liquidity visibility is the lifeline of any business, especially in volatile markets. A 13-week direct cash flow forecast provides the granularity needed to manage working capital and predict shortfalls. We explain how to build a robust model using CapLiquify principles, moving from indirect accounting views to direct cash reality.",
    },
    {
        "title": "Moving Beyond Excel: The Future of Financial Planning & Analysis",
        "category": "FP&A",
        "content": "Excel is flexible but fragile. As organizations scale, spreadsheet-based FP&A becomes a bottleneck plagued by version control issues and calculation errors. Modern FP&A platforms offer real-time data integration, scenario modeling, and automated reporting. Learn when and how to transition your finance function to the cloud.",
    },
    {
        "title": "Scenario Planning for Uncertainty: Stress-Testing Your Model",
        "category": "FP&A",
        "content": "Static budgets are dead. In today's dynamic environment, finance teams must master scenario planning. By stress-testing key drivers—like revenue growth, churn, and COGS—you can build resilience against market shocks. We outline best practices for creating base, bull, and bear cases that actionable insights.",
    },
    {
        "title": "Working Capital Optimization: Unlocking Hidden Cash",
        "category": "FP&A",
        "content": "Working capital is often the cheapest source of cash. By optimizing Accounts Receivable, Accounts Payable, and Inventory, companies can release significant liquidity without external financing. This article dives into the mechanics of the Cash Conversion Cycle and practical levers for improvement.",
    },
    {
        "title": "The CFO's Guide to Real-Time Financial Reporting",
        "category": "FP&A",
        "content": "Closing the books shouldn't take three weeks. Real-time reporting enables agile decision-making. We discuss the technology stack and process changes required to move from monthly look-backs to daily pulse checks, empowering the CFO to act as a strategic business partner.",
    },
    {
        "title": "Variance Analysis: How to Tell the Story Behind the Numbers",
        "category": "FP&A",
        "content": "Reporting a variance is easy; explaining it is an art. Effective variance analysis goes beyond 'price vs. volume' to uncover root causes like operational inefficiencies or market shifts. We provide a framework for narrative reporting that engages the board and drives corrective action.",
    },
    {
        "title": "Automating the Close: Reducing Days Sales Outstanding (DSO)",
        "category": "FP&A",
        "content": "High DSO kills cash flow. Automating the order-to-cash cycle—from invoicing to collections—is the most effective way to bring cash in faster. We review automation tools and process improvements that can shave days off your DSO and improve customer relationships.",
    },
    {
        "title": "FP&A for SaaS: Key Metrics That Matter (ARR, CAC, LTV)",
        "category": "FP&A",
        "content": "SaaS finance is unique. Traditional GAAP metrics don't capture the health of a subscription business. We deep dive into the SaaS metrics playbook: calculating ARR correctly, balancing LTV/CAC ratios, and tracking retention cohorts to ensure sustainable growth.",
    },

    # PMI
    {
        "title": "Post-Merger Integration: The First 100 Days Playbook",
        "category": "PMI",
        "content": "The detailed checklist for PMI success. From Day 1 communications to Day 100 systems migration, this playbook covers every functional area. Learn how to set up your Integration Management Office (IMO) and track progress against value capture targets.",
    },
    {
        "title": "Synergy Tracking: How to Measure and Capture Value",
        "category": "PMI",
        "content": "Synergies are the justification for most deals, but they are notoriously hard to track. We demonstrate how to set up a rigorous tracking mechanism that links initiatives to P&L impact, ensuring that cost savings and revenue uplifts are actually realized.",
    },
    {
        "title": "Change Management in M&A: Navigating Employee Anxiety",
        "category": "PMI",
        "content": "Uncertainty breeds resistance. Effective change management is about transparency and empathy. We share strategies for communicating the vision, addressing job security concerns, and engaging employees in the integration process to minimize attrition.",
    },
    {
        "title": "IT Integration: Merging Systems Without Breaking the Business",
        "category": "PMI",
        "content": "IT integration is often the most complex and expensive part of PMI. Decisions about ERP consolidation, CRM migration, and cybersecurity harmonization must be made early. We outline a risk-based approach to IT integration that prioritizes business continuity.",
    },
    {
        "title": "The PMI Office: Structuring Your Integration Team for Success",
        "category": "PMI",
        "content": "Who runs the integration? A dedicated IMO is essential for complex deals. We discuss the roles and responsibilities of the Integration Leader and functional workstream leads, and how to maintain governance without creating bureaucracy.",
    },
    {
        "title": "Communicating the Deal: Internal and External Stakeholder Plans",
        "category": "PMI",
        "content": "A deal announcement affects customers, suppliers, investors, and employees. A unified communication strategy is vital to control the narrative. We provide templates for Day 1 announcements and ongoing communication loops to keep all stakeholders aligned.",
    },
    {
        "title": "Retaining Key Talent During a Merger or Acquisition",
        "category": "PMI",
        "content": "Acquisitions often fail because the acquired talent walks out the door. Retention bonuses are a start, but culture and career path clarity matter more. Learn how to identify key personnel early and re-recruit them into the new organization.",
    },
    {
        "title": "PMI Checklists: A comprehensive guide to day 1 readiness",
        "category": "PMI",
        "content": "Day 1 must be flawless. Our comprehensive readiness checklist covers legal transfer, payroll continuity, brand updates, and customer support access. Ensure you don't miss a critical step when the deal closes.",
    },

    # Working Capital
    {
        "title": "Optimizing Inventory Turnover: Strategies for Lean Operations",
        "category": "Working Capital",
        "content": "Excess inventory ties up cash and risks obsolescence. We explore demand forecasting techniques and inventory management strategies like JIT (Just-in-Time) to improve turnover ratios without sacrificing fill rates.",
    },
    {
        "title": "Accounts Receivable Management: Best Practices for Getting Paid",
        "category": "Working Capital",
        "content": "Your sale isn't complete until the cash is in the bank. We discuss credit policy optimization, automated dunning, and dispute resolution processes that accelerate collections and reduce bad debt write-offs.",
    },
    {
        "title": "Accounts Payable Strategy: Managing Vendor Relationships",
        "category": "Working Capital",
        "content": "Stretching payables can improve cash flow, but not at the cost of supplier relationships. We look at strategic sourcing, payment term negotiation, and early payment discount analysis to balance liquidity with supply chain stability.",
    },
    {
        "title": "The Cash Conversion Cycle: How to Shorten It",
        "category": "Working Capital",
        "content": "The CCC is the ultimate metric of working capital efficiency. We break down the formula (DIO + DSO - DPO) and provide case studies of companies that transformed their balance sheet by systematically attacking each component.",
    },
    {
        "title": "Supply Chain Finance: Tools for liquidity management",
        "category": "Working Capital",
        "content": "Supply chain finance (reverse factoring) creates a win-win for buyers and suppliers. Buyers keep cash longer, while suppliers get paid early by a bank. We explain how these programs work and when to implement them.",
    },
    {
        "title": "Working Capital Drivers: DPO, DSO, and DIO explained",
        "category": "Working Capital",
        "content": "Back to basics: understanding the three levers of working capital. We provide a deep dive into Days Payable Outstanding, Days Sales Outstanding, and Days Inventory Outstanding, including industry benchmarks.",
    },
    {
        "title": "Liquidity Crises: Early Warning Signs and Remediation",
        "category": "Working Capital",
        "content": "Running out of cash is the end. We identify the red flags of an impending liquidity crunch—like stretching payables or declining margins—and outline immediate triage steps to stabilize the ship.",
    },

    # Pricing
    {
        "title": "Dynamic Pricing Strategies for B2B SaaS",
        "category": "Pricing",
        "content": "Static price lists are leaving money on the table. Dynamic pricing leverages real-time data to adjust quotes based on customer segment, willingness to pay, and market demand. See how ApexDeliver's pricing engine enables smart customization.",
    },
    {
        "title": "Value-Based Pricing: Aligning Price with Customer Outcomes",
        "category": "Pricing",
        "content": "Cost-plus pricing is obsolete. Value-based pricing ties revenue to the ROI you deliver. We guide you through the process of quantifying your value proposition and creating pricing tiers that capture a fair share of that value.",
    },
    {
        "title": "Psychological Pricing: How to Influence Buying Decisions",
        "category": "Pricing",
        "content": "Pricing is as much psychology as it is math. From anchoring effects to the power of '9' endings and decoy options, we explore behavioral economics principles that can nudge prospects toward higher-value packages.",
    },
    {
        "title": "Pricing Power: The Ultimate Indicator of Business Health",
        "category": "Pricing",
        "content": "Warren Buffett calls pricing power the single most important decision in evaluating a business. If you can raise prices without losing customers, you have a moat. We discuss how to build and measure pricing power in your portfolio.",
    },
    {
        "title": "Discount Management: How to Stop Leaking Margin",
        "category": "Pricing",
        "content": "Uncontrolled discounting destroys profitability. We examine the impact of ad-hoc discounts on LTV and suggest governance structures—like approval workflows and floor prices—to maintain price integrity.",
    },
    {
        "title": "Freemium vs. Free Trial: Choosing the Right PLG Model",
        "category": "Pricing",
        "content": "Product-Led Growth (PLG) relies on letting users experience value before paying. But should you offer a forever-free tier or a time-limited trial? We weigh the pros and cons of each model based on your product complexity and cost structure.",
    },
    {
        "title": "Price Increase Execution: How to Raise Prices Without Losing Customers",
        "category": "Pricing",
        "content": "Inflation and product improvements justify price hikes, but communication is key. We provide a communication roadmap for executing price increases that reinforces value and minimizes churn.",
    },
    {
        "title": "Sales & Promotion Pricing: Creating campaigns that convert",
        "category": "Pricing",
        "content": "Promotions drive urgency, but they must be strategic. We look at how to design time-bound offers and bundles that boost short-term revenue without devaluing your brand or creating a 'wait for the sale' mentality.",
    },
]

def seed_posts():
    db = SessionLocal()
    try:
        print(f"Checking for existing blog posts...")
        existing_count = db.query(BlogPost).count()
        print(f"Found {existing_count} existing posts.")
        
        created_count = 0
        for post_data in POSTS:
            slug = slugify(post_data["title"])
            
            # Check if post exists
            existing_post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
            if existing_post:
                print(f"Skipping existing post: {post_data['title']}")
                continue
                
            # Create new post
            new_post = BlogPost(
                title=post_data["title"],
                slug=slug,
                category=post_data["category"],
                content=post_data["content"],
                excerpt=post_data["content"][:200] + "...",
                meta_description=post_data["content"][:160],
                primary_keyword=post_data["category"],
                author="Dudley Peacock",
                read_time_minutes=5,
                published=True,
                published_at=datetime.now(timezone.utc)
            )
            db.add(new_post)
            created_count += 1
            
        db.commit()
        print(f"Successfully seeded {created_count} new blog posts.")
        
    except Exception as e:
        print(f"Error seeding blog posts: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_posts()

